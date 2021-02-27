export const preloadTemplates = async function () {
	const templatePaths = [
		// Add paths to "modules/healthEstimate/templates"
		'modules/healthEstimateSwffg/templates/healthEstimate.hbs'
	]

	return loadTemplates(templatePaths)
}
