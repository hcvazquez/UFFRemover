# UFFOptimizer Benchmark

This page list all the applications selected for the evaluation of our approach. All bundles (original and optimized) can be found in the OPTIMIZATION folder of the respective project (Example for messy, https://github.com/icpc17/UFFOptimizer/tree/master/benchmark/messy/OPTIMIZATION).

Additionally, we include two cvs files with more data. The file "Results data.cvs" details the set of applications, their characteristics and findings. Also, "Results data.cvs" contains the results of our approach and reports for each application the size of the minified bundle. On the other hand, "3party results.csv" shows the applications and the third-party applications that we use for a second validation test. 

## Use to test benchmark applications

To use the UFFOptimizer on a project, first need to ensure that the following steps were performed:

1- Download the source code of the project to optimize from the benchmark or try another project.

2- Install the dependencies

	cd projectToOptimize
	npm install

2- Create the bundle from the source code using the instructions and tools provided by the application. For example:

	npm run-script bundle

3- Run all the tests and verify that they all pass. For example:

	npm run-script test

Once those steps were executed you are already to executing the UFFOptimizer commands. The tool need to be used inside the project to optimize:

	cd projectToOptimize
	node [UFFO_path] [command] [parameters]
