importPackage(org.jboss.as.cli.scriptsupport)

var currentContext = org.mozilla.javascript.Context.getCurrentContext();
var languageVersion = currentContext.getLanguageVersion();
print("Javascript version: " + languageVersion);

var config = eval('(' + readFile("js/deploy/deploy.json") + ')');

cli = CLI.newInstance();
try {
	cli.connect(config.connect.host, config.connect.port, config.connect.username, config.connect.password);
} catch(error) {
	print("Error connecting to: " + config.connect.host + ":" + config.connect.port);
	java.lang.System.exit(1);
}

config.deployments.forEach(function(deployment) {
	var file = new java.io.File(deployment.file);
	if (!file.exists()) {
		print("File does not exist: " + deployment.file);
		java.lang.System.exit(1);
	}
});

config.deployments.forEach(function(deployment) {
	if (typeof deployment.name === "undefined") {
		deployment.name = deployment.file.split("/").reverse()[0];
	}
	if (typeof deployment.undeploy !== "undefined") {
		var result = cli.cmd("/deployment=" + deployment.undeploy + ":read-resource");
		var outcome = result.getResponse().get("outcome").asString();
		if (outcome.equals("success")) {
			print("Undeploying previous: " + deployment.undeploy);
			result = cli.cmd("undeploy " + deployment.undeploy);
			outcome = result.getResponse().get("outcome").asString();
			if (outcome.equals("success")) {
				print("Successfully undeployed previous: " + deployment.undeploy);
			} else {
				print("Error undeploying previous: " + deployment.undeploy);
			}
		}
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
