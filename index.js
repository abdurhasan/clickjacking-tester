const { Worker, isMainThread, workerData } = require('worker_threads');
const fs = require('fs')
const urllib = require('urllib');
const print = console.log


function createPoc(site) {
    const html = `<html>
    <head><title>Clickjack test page</title></head>
    <body>
      <p>Website is vulnerable to clickjacking!</p>
      <iframe src="${site}" width="500" height="500"></iframe>
    </body>
 </html>`

    return new Promise((resolve, reject) => {
        fs.writeFile(`${site}.html`, html, 'utf8', err => {
            if (!err) {
                resolve(true)
            }

            reject(err)
        });
    })

}

function checkUrl(site) {
    return new Promise((resolve, reject) => {
        urllib.request(site).then(function (result) {
            const Header = JSON.stringify(result.res.headers)
            const XFrame = !/x-frame-options/i.test(Header)
            resolve(XFrame)

        }).catch(function (err) {
            reject(err)
        });

    })


}

function listSites() {

    return new Promise((resolve, reject) => {
        if (!process.argv[2]) {
            reject("[*] Usage: node clickjacking_tester.js <file_name>")
        }

        fs.readFile(`./${process.argv[2]}`, 'utf8', function (err, data) {
            if (!err) {
                resolve(data.split("\n"))

            }
            reject(err)

        });

    })
}

async function main() {
    try {
        if (isMainThread) {   // Main Thread
            const _listSites = await listSites()

            for (let index = 0; index < _listSites.length; index++) {
                const worker = new Worker(__filename, { workerData: _listSites[index] });

                // worker.once('error', err => {
                //     throw err
                // });

            }


        } else {       // Child Thread

            (async () => {
                const site = workerData
                const _checkUrl = await checkUrl(site)

                if (_checkUrl) {

                    print(`[+] Website is vulnerable!  : ${site}`)
                    const _createPoc = await createPoc(site)
                    if (_createPoc) {
                        print(`[*] Created a poc and saved to ${site}.html \n`)
                    }

                } else {
                    print(`[-] Website is not vulnerable!  : ${site} \n`)
                }

            })()



        }


    } catch (error) {
        print(error)
    }

}



main()




