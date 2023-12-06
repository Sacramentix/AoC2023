import { isMainThread, parentPort, Worker } from "node:worker_threads";
import { processPart } from "./part2Worker.js";
import { fileURLToPath } from "node:url";

function proccessWithWorker(input:number) {
  return new Promise<number>((resolve, reject) => {
    const worker = new Worker(fileURLToPath(import.meta.url));
    worker.on("message", (e) => {
      // console.log("from worker: ", e);
      resolve(Number(e)); // Resolve the promise with the worker's message
      worker.terminate(); // Terminate the worker after receiving the message
    });
    
    worker.on("error", (e) => {
      console.log("error worker: ", e.message);
      reject(e.message); // Reject the promise if there's an error
    });

    worker.postMessage(input); // Send the element to the worker
  });
}
export const THREAD_AMOUNT = 12;

if (isMainThread) {
  const perf = performance.now();

  const workersPromise:Promise<number>[] = []
  for (let i=0;i<THREAD_AMOUNT;i++) {
      workersPromise.push(proccessWithWorker(i));
      console.log(`Worker ${i} spawn!`);
  }
  console.log(Math.min(...await Promise.all(workersPromise)));
  console.log(`Found in ${performance.now()-perf}ms`);
} else {
  parentPort.on("message",(e)=>{
    // console.log(e);
    processPart(Number(e));
  })
}
// 70478642