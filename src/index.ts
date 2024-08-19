import app from "./app";
import config from "./config/config";
import { TrainLineService } from "./services/TrainLineService";

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
  });
  
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const server = app.listen(config.server.port, () => console.log('Server running on port 3000'));

process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully');
    server.close(() => {
      console.log('Process terminated');
    });
});

// TrainLineService.createGraphProjection().then(() => {
//     console.log('Graph projection created');
//   }).catch(error => {
//     console.error('Error creating graph projection:', error);
//   });

// TrainLineService.testCode().then(() => {
//     console.log('Test code executed');
//   } ).catch(error => {  
//     console.error('Error executing test code:', error);
//   }   );

  // TrainLineService.getOptimalRoute1('Hoston','23rd').then(() => {
  //   console.log('Test code executed');
  // } ).catch(error => {  
  //   console.error('Error executing test code:', error);
  // }   );


