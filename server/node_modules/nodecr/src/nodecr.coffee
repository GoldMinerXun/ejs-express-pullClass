exec	= require('child_process').exec
fs		= require 'fs'
tmp		= require 'tmp'

###
Attention: Tesseract 3.01 or higher is needed for this to work
###
class Tesseract
	
	###
	@param image	Can be any format that your installed Leptonica library can process
	(additional libraries might be required by Leptonica)
	
	@param callback	A function pointer
	this function is called after the recognition has taken place
	with a possible error as first and the resulting recognized text as second parameter
	
	@param languageCode	(Optional) a language code for the language to recognise
	see http://code.google.com/p/tesseract-ocr/downloads/list for available languages (xxx.traineddata.gz)
	any language you pass as an argument here must be unzipped into the tessdata directory beforehand
	
	@param pageSegMode	(Optional) The page segmentation mode.
	As of March 4, 2012 tesseract supports the following options:
	
	0 = Orientation and script detection (OSD) only.
	1 = Automatic page segmentation with OSD.
	2 = Automatic page segmentation, but no OSD, or OCR
	3 = Fully automatic page segmentation, but no OSD. (Default)
	4 = Assume a single column of text of variable sizes.
	5 = Assume a single uniform block of vertically aligned text.
	6 = Assume a single uniform block of text.
	7 = Treat the image as a single text line.
	8 = Treat the image as a single word.
	9 = Treat the image as a single word in a circle.
	10 = Treat the image as a single character.
	
	See http://code.google.com/p/tesseract-ocr/source/browse/trunk/api/tesseractmain.cpp#95 for current state of options
	
	@param config	(Optional) A config file name
	###
	process: (image, callback, languageCode, pageSegMode, config, preprocessor) ->
		(preprocessor or @preprocessor) image, (err, processedImage, cleanup) =>
			if err
				# error in preprocessor
				callback err, null
				return

			f = (err, text) =>
				if cleanup?
					@log "node-tesseract: Preprocessor cleanup"
					cleanup()
				callback err, text
				return

			@_runTesseract processedImage, f, languageCode, pageSegMode, config
			return

	_runTesseract: (image, callback, languageCode, pageSegMode, config) ->
		
		# generate output file name
		tmp.tmpName (err, output) =>
			if err
				# Something went wrong when generating the temporary filename
				callback err, null
				return
			
			# assemble tesseract command	 
			command = [
				@binary
				image
				output
			]
			if languageCode
				command.push '-l'
				command.push languageCode

			if typeof pageSegMode isnt 'undefined' and pageSegMode isnt null
				command.push '-psm'
				command.push pageSegMode

			command.push config	if config

			command = command.join ' '
			
			# Run the tesseract command
			@log "node-tesseract: Running '#{command}'"
			exec command, (err, stdout, stderr) =>
				if err
					
					# Something went wrong executing the assembled command
					callback err, null
					return
				outputFile = output + '.txt'
				fs.readFile outputFile, (err, data) =>
									
					# There was no error, so get the text
					data = data.toString @outputEncoding unless err
					@log "node-tesseract: Deleting '#{outputFile}'"
					fs.unlink outputFile, (err) ->
						# ignore any errors here as it just means we have a temporary file left somewehere
					
					# We got the result (or an error)
					callback err, data
					return
				return
			return
		return
	
	###
	A no-op preprocessor
	
	@param inputFile	The file to process
	@param callback	 The callback to call when the processing is done (1st argument error, 2nd the outputfile (the processed input file))
	###
	preprocessor: (inputFile, callback) ->
		# the default preprocessor does nothing...
		error = null
		outputFile = inputFile
		cleanup = ->
			# clean up here
			return

		# this gets called after the preprocessed image has been used
		callback error, outputFile, cleanup
		return

	log: ->
		console.log.apply console, arguments
		return

	binary: 'tesseract'
	outputEncoding: 'UTF-8'
	preprocessors:
		convert:	ConvertPreprocessor = (inputFile, callback) ->
						tesseract.log "node-tesseract: preprocessor: convert: Processing '#{inputFile}'"
						tmp.tmpName postfix: '.tif', (err, outputFile) ->
							if err
								# Something went wrong when generating the temporary filename
								callback err, null
								return

							command = [
								'convert'
								'-type'
								'Grayscale'
								'-resize'
								'200%'
								'-sharpen'
								'10'
								inputFile
								outputFile
								].join ' '
							tesseract.log "node-tesseract: preprocessor: convert: Running '#{command}'"
							exec command, (err, stdout, stderr) ->
								if err
									# Something went wrong executing the convert command
									callback err, null
								else
									cleanup = ->
										tesseract.log "node-tesseract: preprocessor: convert: Deleting '#{outputFile}'"
										fs.unlink outputFile, (err) ->
											# ignore any errors here as it just means we have a temporary file left somewehere
											return
										return
									
									callback null, outputFile, cleanup
								return
							return
						return

tesseract = new Tesseract
# Exports
module.exports = tesseract