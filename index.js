const fs = require('mz/fs')
const cheerio = require('cheerio')
const imgDownload = require('image-downloader')

/**
 * Get all file path in local
 * @param {String} folderName
 */
async function getFilePath(folderName, result = []) {
	await fs.readdirSync(folderName).forEach((filePath, i) => {
		result[i] = filePath
	})
	return result
}

// const orginFile = ['./originFile/1.xml', './originFile/2.xml', './originFile/3.xml']

/**
 * To get all urls of image in a file
 * @param {String} filePath
 */
async function getUrlImagesFromFile(filePath, listUrl = []) {
	const temp = await fs.readFileSync(filePath, { encoding: 'utf8' }, (err, data) => {
		return data
	})
	const $ = cheerio.load(temp)
	$('img').each((i, e) => {
		listUrl[i] = e.attribs.src.toString()
	})
	return listUrl
}

/**
 * Download to a directory and save with the original filename
 * @param {Array} listUrl
 */
async function downloadImages(listUrl, resulFolder) {
	listUrl.forEach(img => {
		let options = {
			url: img,
			dest: resulFolder,
		}
		imgDownload(options)
	})
}

async function main() {
	const folderName = './originFile'
	const orginFile = await getFilePath(folderName)
	orginFile.forEach(async (filePath, i) => {
		const resultFolder = `./result_${i}`
		if (!fs.existsSync(resultFolder)) {
			fs.mkdirSync(resultFolder)
		}
		const fileName = folderName + '/' + filePath
		const listUrl = await getUrlImagesFromFile(fileName)
		console.log(listUrl)
		await downloadImages(listUrl, resultFolder).catch(err => console.log(err))
	})
}

main()
