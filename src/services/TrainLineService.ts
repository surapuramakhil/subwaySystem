import neo4jDriver from '../neo4j/neo4jDriver';
import { AppError } from '../utils/AppError';

export class TrainLineService {

  static async createGraphProjection() {
    const session = neo4jDriver.session();
    try {
      const existsResult = await session.readTransaction(tx =>
        tx.run(`
          CALL gds.graph.exists('subwayGraph')
          YIELD exists
          RETURN exists
        `)
      );
  
      const graphExists = existsResult.records[0].get('exists');
  
      if (!graphExists) {
        await session.writeTransaction(tx =>
          tx.run(`
            CALL gds.graph.project(
              'subwayGraph',
              'Station',
              'CONNECTS_TO',
              {
                relationshipProperties: ['fare', 'weight']
              }
            )
          `)
        );
        console.log('Graph projection created successfully');
      } else {
        console.log('Graph projection already exists');
      }
    } catch (error) {
      console.error('Error in createGraphProjection:', error);
      throw error;
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
          ON CREATE SET r.lines = [$name], r.fare = $fare, r.weight = 1
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
            relationshipWeightProperty: 'weight'
          })
          YIELD nodeIds, costs
          WITH gds.util.asNodes(nodeIds) as path, costs
          RETURN 
            [node IN path | node.name] as stationNames,
            CASE 
              WHEN size(costs) > 1 THEN costs[1]
              ELSE 0
            END as totalFare
          `,
          { origin, destination }
        )
      );
  
      if (result.records.length === 0) {
        throw new Error('No route found');
      }
  
      const path = result.records[0].get('stationNames');
      let totalFare = result.records[0].get('totalFare');
      
      if (typeof totalFare === 'object' && totalFare !== null && 'toNumber' in totalFare) {
        totalFare = totalFare.toNumber();
      } else if (typeof totalFare === 'string') {
        totalFare = parseFloat(totalFare);
      } else if (typeof totalFare !== 'number') {
        totalFare = 0; // Default to 0 if the value is unexpected
      }

  
      return { path, totalFare };
    } finally {
      await session.close();
    }
  }

  async getLineFare(station: string): Promise<number> {
    const session = neo4jDriver.session();
    try {
      const result = await session.readTransaction(tx =>
        tx.run(
          `
          MATCH (s:Station {name: $station})-[r:CONNECTS_TO]-()
          RETURN r.fare AS fare
          LIMIT 1
          `,
          { station }
        )
      );
  
      if (result.records.length === 0) {
        throw new AppError('Station not found or has no connections', 404);
      }
  
      let fare = result.records[0].get('fare');
      
      if (typeof fare === 'object' && fare !== null && 'toNumber' in fare) {
        fare = fare.toNumber();
      } else if (typeof fare === 'string') {
        fare = parseFloat(fare);
      } else if (typeof fare !== 'number') {
        throw new AppError('Invalid fare value', 500);
      }
  
      return fare;
    } finally {
      await session.close();
    }
  }

}