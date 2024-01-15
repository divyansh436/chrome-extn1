const btn = document.querySelector('.change-color-btn');
const colorGrid = document.querySelector('.color-grid');
const colorValue = document.querySelector('.color-value');

btn.addEventListener('click', async () => {

    // background 
    chrome.storage.sync.get('color', ({color})=>{
        console.log('color: ',color);
    });


    let [tab] = await chrome.tabs.query({active:true, currentWindow: true});
    
    chrome.scripting.executeScript({
        target:{ tabId: tab.id},
        function: pickColor,
    },async(injectionResults)=>{
        const [data] = injectionResults;
        if(data.result){
            const color = data.result.sRGBHex;
            colorGrid.style.backgroundColor = color; 
            colorValue.innerText = color;
            try{
                await navigator.clipboard.writeText(color);
            }
            catch(err){
                console.error(err);
            }
        }
    });
});


async function pickColor(){
    try{
        // picker
        const eyedropper = new EyeDropper();
        return await eyedropper.open();
    }
    catch(err){
        console.error(err);
    }
}