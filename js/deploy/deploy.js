importPackage(org.jboss.as.cli.scriptsupport)

var currentContext = org.mozilla.javascript.Context.getCurrentContext();
var languageVersion = currentContext.getLanguageVersion();
print("Javascript version: " + languageVersion);

var config = eval('(' + readFile("js/deploy/deploy.json") + ')');

cli = CLI.newInstance();
cli.connect(config.connect.host, config.connect.port, config.connect.username, config.connect.password);

config.deployments.forEach(function(deployment) {
	if (typeof deployment.name === "undefined") {
		deployment.name = deployment.file.split("/").reverse()[0];
	}
	print("Checking " + deployment.name);
	var result = cli.cmd("/deployment=" + deployment.name + ":read-resource");
	var outcome = result.getResponse().get("outcome").asString();
	if (!outcome.equals("success")) {
		print("Need to deploy: " + deployment.name);
		result = cli.cmd("deploy " + deployment.file);
		outcome = result.getResponse().get("outcome").asString();
		if (outcome.equals("success")) {
			print("Successfully deployed: " + deployment.name);
		}
		else {
			print("Error deploying: " + deployment.name);
		}
	} else {
		print("Already deployed: " + deployment.name);
	}
});

cli.disconnect();
