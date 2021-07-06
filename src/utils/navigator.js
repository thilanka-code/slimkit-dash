/**
 * This script maintains app wide navigation
 */

export let routeTree;

class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.children = [];
        this.parent = null;
        this.params = {}
    }
    /**
     * 
     * @returns Full path of the node from the root
     */
    getFullPath() {
        let temp = this.parent
        let path = this.key
        while (temp) {
            temp.key = temp.key == '/' ? '' : temp.key
            path = temp.key + "/" + path
            temp = temp.parent
        }
        return path
    }
}

class Tree {
    constructor() {
        this.root = new Node('/');
    }

    /**
     * Retrieves the leaf node. This node will contain all path params
     * @param "/stores/items/12" path to search
     * @returns Node
     */
    getPathData(path) {
        // path = '/'
        if (path == this.root.key) {
            return this.root
        }
        let pathsArray = path.split("/")
        let paths = pathsArray.length > 1 ? pathsArray.splice(1) : pathsArray
        let temp = this.root
        for (const subPath of paths) { //for each subpath in the url
            for (const child of temp.children) {//for each child in the current parent
                child.params = { ...temp.params } //copy existing params
                let isMatched
                if (child.key.startsWith(':')) {
                    isMatched = true
                    child.params[child.key.split(":").splice(1)] = subPath
                }
                if (child.key == subPath) {
                    isMatched = true
                }
                if (isMatched) {
                    temp = child
                    break;
                }
            }
        }
        return temp
    }
}

/**
 * Build route tree internally so navigate can yeild results. After route data are built,
 * it will automatically call navigate on the current URL and return the module (page) and parameters
 * 
 * @param "/": { component: async () => import('./pages/Form.svelte'), params: { } },
         "/about": { component: async () => import('./pages/About.svelte') }, routes 
 */
export const init = async (routes) => {

    routeTree = new Tree();

    for (let routeKey of Object.keys(routes)) {
        buildRouteTree(routeKey, routes[routeKey], routeTree.root);
    }
    
    console.log(routeTree);
    //Navigate to current browser URL after initialization
    return  await navigate(window.location.pathname)
}

/**
 * 
 * @param "/store" key 
 * @param {"/items": { component: './ListItem.svelte'},
 *         "/items/:id": { component: './Item.svelte'}
 *          } value 
 * @param Node parent
 * @returns 
 */
function buildRouteTree(key, value, parent) {//key: '/some/:name', value: {compo: {} },  parent: :id

    if (key == "/") {
        parent.value = value
        return
    }

    let pathsArray = key.split("/")
    let paths = pathsArray.length > 1 ? pathsArray.splice(1) : pathsArray


    let tempParent = parent //root Node
    outer: for (const path of paths) { // ['/some', ':name']
        let newNode = new Node()
        if (value.component) {
            newNode.value = { component: value.component, params: value.params }
        }
        let existingChildFound
        for (const child of tempParent.children) { //initially []
            if (child.key == path) {
                tempParent = child
                existingChildFound = true
                break;
            }
        }

        if (!existingChildFound) {
            newNode.key = path
            newNode.parent = tempParent
            tempParent.children = [...tempParent.children, newNode]
            tempParent = newNode
            // let tar = value.component() ? value.component()[0] : value.component
        }
    }
    let component = value.component
    if (typeof component == 'function') {
        component = component({ ...value.params })[0]
    }

    //Check if there are children left
    let subPaths = Object.keys(value).filter(v => v.startsWith("/")) ///some/:name
    for (const subPath of subPaths) { //['/some/:name']
        buildRouteTree(subPath, value[subPath], tempParent) //subpath: '/some/:name', value: {compo: {} },  parent: :id
    }
}

/**
 * Returns module (page) and parameters for a given url path
 * @param path string Eg: /some/:2 
 * @returns {module, params}
 */
export const navigate = async (path) => {

    const pathData = routeTree.getPathData(path)
    if (pathData && pathData.value) {
        if(path != "/") window.history.replaceState("", "", path)
        let [module, clientParams] = await pathData.value['component']({...pathData.params});
        return { module: module.default, params: clientParams }
    }
}


