/**
 * 
 * This Rollup plugin will get the generated main.js chunk file and save
 * its file name in Nodejs global scope so that it can be consumed in the
 * service-worker copy plugin 
 */
 export function updateServiceWorker() {

    return {
        name: 'update-service-worker',
        // Type: (code: string, chunk: ChunkInfo, options: OutputOptions) => string | { code: string, map: SourceMap } | null
        renderChunk: async (code, chunk, options) => {

            if (!chunk.fileName.startsWith('main-')) return;
            // if (chunk.fileName.startsWith('main-')) {
                console.log("renderChunk updateServiceWorker")
                //replace main.js chunk file Eg: main-7db47dehj.js in service worker
                global.mainFileName = chunk.fileName; //Storing main js chunk name on global variable
            // }
        },
    }
}