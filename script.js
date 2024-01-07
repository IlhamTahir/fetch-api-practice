

const outputElement = document.querySelector('#output-area')


const fetchData = async ({
                        onData,
                        onDone
                         })=> {
    const controller = new AbortController()

    try {

    const response = await fetch('http://localhost:3000/stream-data',
        {
            signal: controller.signal
        })
    const reader = response.body.getReader()
    const textDecoder = new TextDecoder('utf-8');

    while (true) {
        const {done, value} = await reader.read()
        if (done) {
            onDone()
            break;
        }
        onData(textDecoder.decode(value, {stream: true}))
    }

    } catch (e) {
        console.log(e)
    }

    return {
        stop: () => {
            controller.abort()
        }
    }
}


const startBtn = document.querySelector('#start-btn')
const stopBtn = document.querySelector('#stop')


let fetchMange = null
startBtn.addEventListener('click', () => {
     if (!fetchMange) {
          fetchData({
             onData: (value) => {
                 outputElement.innerHTML += value
             },
             onDone: () => {
                 console.log('请求完毕')
             }
         }).then(res=>{
             fetchMange = res
          })
     }
})

stopBtn.addEventListener('click', () => {
    fetchMange && fetchMange.stop()
})


