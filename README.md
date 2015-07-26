# JBoss CLI Javascript

I always try to limit the amount of programming/scripting languages I have to learn to get the job done.
Obviously one cannot get around Java to do some serious server-side stuff.
These days with AngularJS and such, you also cannot get around Javascript.
Hence this project allows me to perform simple devops tasks on JBoss EAP from within Javascript.


## Requirements

* Java
* Rhino
* JBoss EAP


## Configuration

Configuration lives in:
```
jboss-cli-js.conf
```


## Usage

Example usage:
```
./jboss-cli-js.sh js/hello-world/hello-world.js
```

A simple Javascript to manage deployments on a JBoss:
```
./jboss-cli-js.sh js/deploy/deploy.js
```

Configuration for this script lives under `js/deploy/deploy.json`.