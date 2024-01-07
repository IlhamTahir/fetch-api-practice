

const outputElement = document.querySelector('#output-area')


const fetchData = ({
                        onData,
                        onDone
                         })=> {
    const controller = new AbortController()
    let status = 'pending'
    const start = async () => {
        if (status === 'executing') {
            alert('已经在请求了，请勿重复提交')
            return
        }
        try {
            const response = await fetch('http://localhost:3000/stream-data',
                {
                    signal: controller.signal
                })
            const reader = response.body.getReader()
            const textDecoder = new TextDecoder('utf-8');
            status = 'executing'
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
        } finally {
            status = 'done'
        }

    }

    const stop = () => {
        controller.abort()
    }

    return {
        start,
        stop
    }
}


const startBtn = document.querySelector('#start-btn')
const stopBtn = document.querySelector('#stop')



fetchMange = fetchData({
    onData: (value) => {
        outputElement.innerHTML += value
    },
    onDone: () => {
        console.log('请求完毕')
    }
})
startBtn.addEventListener('click', () => {
    fetchMange.start()
})

stopBtn.addEventListener('click', () => {
    fetchMange && fetchMange.stop()
})


