![UFFO Image](http://fs5.directupload.net/images/170302/d5zleuc5.png)
# UFFOptimizer

UFFOptimizer is a slimming JavaScript application tool for identifier and remover of unused foreign functions (UFF). 

## Installation

UFFOptimizer is developed on Node.js execution environment (v6.1.0). The following steps are needed for run the tool:

1- install Node.js environment  
Node.js can be download from (https://nodejs.org)

2- Download the project from github:

    git clone git://github.com/icpc17/UFFOptimizer.git
    cd UFFOptimizer

3- Install the project dependencies:

    npm install

## Regular Use

UFFOptimizer is designed to optimize single bundle files for use in the browser. The tool need to be used inside the project to optimize:

	cd projectToOptimize
	node [UFFO_path]/UFFOptimizer [command] [parameters]

### Instrument a file

To instrument a file you can execute the following command:

	node [UFFO_path]/UFFOptimizer instrument_file [file_to_instrument]

For Example:

	node ../../UFFOptimizer instrument dist/bundle.js

### Generate profiling info

You need to run your application so that the instrumented file generates the profiling information. You need to save this information in a file, eg "profiling.txt".

### Optimize a file

You can optimize you original file as follow.

	node [UFFO_path]/UFFOptimizer optimize [file_to_optimize] [profiling_file]

For Example:

	node ../../UFFOptimizer optimize dist/bundle.js profiling.txt

Or, you can optimize your file directly from the instrumented file.

	node [UFFO_path]/UFFOptimizer optimize_instrumented_file [file_to_optimize] [profiling_file]

For Example:

	node ../../UFFOptimizer optimize_instrumented_file dist/bundle.js profiling.txt

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
	node [UFFO_path]/UFFOptimizer [command] [parameters]
	

## Other Commands and parameters

### Identify the required modules

To identify the required modules of the application you can execute the following command:

	node [UFFO_path]/UFFOptimizer modules [main file]
	
For Example:

	node ../../UFFOptimizer modules src/index.js

### Instrument the required modules

To instrument the required modules of the application you can execute the following command:

	node [UFFO_path]/UFFOptimizer instrument [main file]
	
For Example:

	node ../../UFFOptimizer instrument src/index.js
	
### Optimize the required modules

To optimize the required modules of the application you need to run the tests of the project to optimize with the required modules instrumented. Additionally you need to put the results of the tests in a file named "profiling.txt" in the root of the project to optimize. Then you can execute the following command:

	node [UFFO_path]/UFFOptimizer optimize [main file]
	
For Example:

	npm run-script test > profiling.txt
	node ../../UFFOptimizer optimize src/index.js

To obtain the optimized bundle you need to generate it again:

	npm run-script bundle
