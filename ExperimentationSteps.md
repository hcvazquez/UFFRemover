![UFFO Image](http://fs5.directupload.net/images/170302/d5zleuc5.png)
# UFFOptimizer

UFFOptimizer is a slimming JavaScript application tool for identifier and remover of unused foreign functions (UFF). 

## Installation

UFFOptimizer is developed on Node.js execution environment (>= v6.1.0). The following steps are needed for run the tool:

#### 1. install Node.js environment  
Node.js can be download from (https://nodejs.org)

#### 2. Download the project from github

    git clone git://github.com/icpc17/UFFOptimizer.git
    cd UFFOptimizer

#### 3. Install the project dependencies

    npm install

## Optimization

#### 1. Go to the project to optimize

For Example:
	cd [project_to_optimize_path]

#### 2. Instrument your js code using the following command

	node [UFFO_path] instrument_file [file_to_instrument]

For Example:
	node ../../UFFOptimizer instrument_file bundle.js

> This step generates a new file, e.g. bundle-instrumented.js

#### 3. Replace original file with instrumented file

To generate profiling info you need to replace in your site the original file with the instrumented file.

For Example:
Replace
	<script src="bundle.js"></script> 
With
	<script src="bundle-instrumented.js"></script> 
	
#### 5. Generate profiling info

You need to run your application and use it. This step print profiling information about used functions into the browser console.

#### 6. Save the browser console output into a file

For this step, you need to open the browser console and save the content into a file.

#### 7. Now, you can use the registered information to optimize your application

> Note: The file to optimize need to be the original file.

You can optimize you original file as follow.

	node [UFFO_path] optimize_file_browser [file_to_optimize] [profiling_file]

For Example:

	node ../../UFFOptimizer optimize_file_browser bundle.js profiling.txt

> This step generates a new file, e.g. bundle-optimized.js

#### 8. Test your optimization file

To test your optimized file you need to replace in your site the original file with the optimized file.

For Example:

Replace

	<script src="bundle.js"></script>

With

	<script src="bundle-optimized.js"></script>
