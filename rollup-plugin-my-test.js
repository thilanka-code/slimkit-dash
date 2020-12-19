/**
 * This is a plugin template for custom Rollup plugins
 */

var fs = require('fs');
export function baseRef() {
    return {
        name: 'thilanka-base-ref',
        load: (id)=> {
            if(id.endsWith(".svelte")) {
                console.log('Processing file ====================================== x: '+id)
                // let y = fs.readFileSync(id, 'utf-8');
                // console.log(y);
            } else {
                // console.log('Nope file x: '+id)
            }
        }
    }
}

export function copyReplaceFile(config = {source, dest}) {


    return {
        name: 'copy-replace-file',
        buildStart: async (obj) => {
            console.log('OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');
            
            await fs.copyFile(config.source, config.dest, (ex)=> {
                if(ex) throw ex;
                // console.log();
                console.log(config.source + ' was copied to '+config.dest);
            });
            
            // await new Promise(r => setTimeout(r,7000));
            if (!fs.existsSync(config.dest)) {
                console.log(config.dest+' is not found');
                
            } else {
                console.log('Woah');
            }
        }
    }
}

export function test() {

    return {
        name: 'testerrrr',
        buildStart: () => {
            console.log('Test plugin exec..');
            console.log(process.env);
            
        }
    }
}




export function another() {

    return {
        name: 'another',
        buildStart: (id) => {
            // if(id.endsWith("App.svelte")) {
                console.log('Processing file ======================================= zzzzzzzzzzzzzzzzzzzzzzzzzzzzz: '+id)
                if (process.env.NODE_ENV === 'production') {

                }
                console.log(process.env.dirname);
                // console.log(process.env.NODE_ENV);
                
                // let y = fs.readFileSync(id, 'utf-8');
                // console.log(y);
            // }
        }
    }
}
