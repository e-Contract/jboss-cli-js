#!/bin/bash
if test "$#" -ne 1
then
	echo "Usage: $0 your-script.js"
	exit 1
fi

source jboss-cli-js.conf

if [ ! -f "$RHINO_JAR" ]
then
	echo "Rhino not found."
	exit 1
fi

if [ ! -d "$JBOSS_HOME" ]
then
	echo "JBoss home not found."
	exit 1
fi

java -cp $RHINO_JAR:$JBOSS_HOME/bin/client/jboss-cli-client.jar org.mozilla.javascript.tools.shell.Main -f $1
