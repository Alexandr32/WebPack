import { TsClass } from "./tsclass";

function createAnalytics() : object {
    let counter = 0;
    let destroit = false;

    let tsClass : TsClass = new TsClass('log2');
    tsClass.printLog();
    
    const listener = () => counter++;

    document.addEventListener('click', listener);

    return {
        destroy() {
            document.removeEventListener('click', listener);
            destroit = true;
        },
        getClick() {
            if(destroit) {
                return 'Analytics is destroy'
            }
            return counter;
        }
    }
}

window.addEventListener('click', createAnalytics);