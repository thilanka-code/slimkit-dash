
export let routeData = {
    
    "/": { component: async () => [await import('./pages/Form.svelte'), { }] },
    "/about": { component: async () => [await import('./pages/About.svelte')] },
    // "/store": {
    //     '/cat': {
    //         component: async () => [await import('./pages/store-inventory/ListCategory.svelte')],
    //         '/:id': {
    //             component: async (args) => {
    //                 let params = args.id == 'new' ? {} : { isEdit: true, catId: args.id }
    //                 return [await import('./pages/store-inventory/Category.svelte'), params]
    //             },
    //         }
    //     },
    // }
}