import neo4jDriver from '../neo4j/neo4jDriver';
import { AppError } from '../utils/AppError';

export class TrainLineService {

  static async testCode() {
    const session = neo4jDriver.session();
    try {
      const result = await session.writeTransaction(tx =>
        tx.run(`
        CALL gds.graph.list()
        `)
      );
      console.log(JSON.stringify(result.records[0].toObject(), null, 2));

    } finally {
      await session.close();
    }
  }

  static async createGraphProjection() {
    const session = neo4jDriver.session();
    try {
      await session.writeTransaction(tx =>
        tx.run(`
          CALL gds.graph.project(
            'subwayGraph',
            'Station',
            'CONNECTS_TO',
            {
              relationshipProperties: 'fare'
            }
          )
        `)
      );
    } finally {
      await session.close();
    }
  }
  
  async addTrainLine(name: string, stations: string[], fare: number): Promise<void> {
    const session = neo4jDriver.session();
    try {
      await session.writeTransaction(tx =>
        tx.run(
          `
          UNWIND range(0, size($stations) - 2) AS i
          MERGE (s1:Station {name: $stations[i]})
          MERGE (s2:Station {name: $stations[i+1]})
          MERGE (s1)-[r:CONNECTS_TO]->(s2)
          ON CREATE SET r.lines = [$name], r.fare = $fare
          ON MATCH SET r.lines = CASE WHEN NOT $name IN r.lines THEN r.lines + $name ELSE r.lines END,
                       r.fare = CASE WHEN $fare < r.fare OR r.fare IS NULL THEN $fare ELSE r.fare END
          `,
          { stations, name, fare }
        )
      );
    } finally {
      await session.close();
    }
  }

  async getOptimalRoute(origin: string, destination: string): Promise<{ path: string[], totalFare: number }> {
    const session = neo4jDriver.session();
    try {
      const result = await session.readTransaction(tx =>
        tx.run(
          `
          MATCH (start:Station {name: $origin}), (end:Station {name: $destination})
          CALL gds.shortestPath.dijkstra.stream('subwayGraph', {
            sourceNode: start,
            targetNode: end,
            relationshipWeightProperty: 'fare'
          })
          YIELD nodeIds, costs
          RETURN gds.util.asNodes(nodeIds) as path, costs
          `,
          { origin, destination }
        )
      );
      
      console.log(result);

      if (result.records.length === 0) {
        console.log(`No path found between ${origin} and ${destination}`);
        throw new AppError(`No path found between ${origin} and ${destination}`, 404);
      }

      const path = result.records[0].get('path').map((node: any) => node.properties.name);
      const totalFare = result.records[0].get('costs')[result.records[0].get('costs').length - 1];
      return { path, totalFare };
    } finally {
      await session.close();
    }
  }

}