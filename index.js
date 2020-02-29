const fs = require('fs')
const cheerio = require('cheerio')
const imgDownload = require('image-downloader')

const resultFolder = __dirname + '/result'
const fileName = __dirname + '/temp.txt'

/**
 * To get all urls of image in a file
 * @param {String} filePath
 */
const getUrlImagesFromFile = filePath => {
	let listUrl = []
	const data = fs.readFileSync(filePath, { encoding: 'utf8' })
	const $ = cheerio.load(data)('img')
	$.each((i, e) => {
		listUrl[i] = e.attribs.src
	})
	return listUrl
}

/**
 * Download to a directory and save with the original filename
 * @param {Array} listUrl
 */
const downloadImages = async (listUrl, resulFolder) => {
	for (const imageUrl of listUrl) {
		let options = {
			url: imageUrl,
			dest: resulFolder,
		}
		await imgDownload(options)
	}
}

const renewFolder = folderPath => {
	if (fs.existsSync(folderPath)) {
		fs.rmdirSync(folderPath)
	}
	if (!fs.existsSync(folderPath)) {
		fs.mkdirSync(folderPath)
	}
}

const main = () => {
	renewFolder(resultFolder)
	const listUrl = getUrlImagesFromFile(fileName)
	downloadImages(listUrl, resultFolder).catch(err => console.log(err))
}

main()
