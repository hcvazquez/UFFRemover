![UFFO Image](http://fs5.directupload.net/images/170302/d5zleuc5.png)
# UFFOptimizer

UFFOptimizer is a slimming JavaScript tool for identifying and removing unused foreign functions (UFF).

## Installation

> Attention: UFFOptimizer only supports ES5!

UFFOptimizer is developed using Node.js execution environment (>= v6.1.0). The following steps are needed for running the tool:

#### 1. Install Node.js environment  
Node.js can be downloaded from (https://nodejs.org)

#### 2. Download the project from github

    git clone git://github.com/hcvazquez/UFFOptimizer.git
    cd UFFOptimizer

#### 3. Install the project dependencies

    npm install

## Optimization

#### 1. Go to the path of the project to optimize

> If you don't have one, you can try downloading the Math.js experiment example from https://github.com/hcvazquez/ExperimentExample and following the instructions to run a local server.

For Example:
	cd [project_to_optimize_path]

#### 2. Instrument your js code using the following command

	node [UFFO_path] instrument_file [file_to_instrument]

For Example:
	node ../../UFFOptimizer instrument_file bundle.js

> This step generates a new file, e.g. bundle-instrumented.js

In math.js example:

![image](https://github.com/hcvazquez/UFFOptimizer/blob/master/experiment/img/instrument.png)

#### 3. Replace original file with instrumented file

To generate profiling info you need to replace in your site the original file with the instrumented file.

For Example:
Replace
	<script src="bundle.js"></script> 
With
	<script src="bundle-instrumented.js"></script>

In math.js example:

![image](https://github.com/hcvazquez/UFFOptimizer/blob/master/experiment/img/replace-instrumented.png)
	
#### 5. Generate profiling info

You need to run your application and use it. This step print profiling information about used functions into the browser console.

#### 6. Save the browser console output into a file

For this step, you need to open the browser console and save the content into a txt file.

> Note: In Chrome, please check that "info" logging level is enable.

In math.js example:

![image](https://github.com/hcvazquez/UFFOptimizer/blob/master/experiment/img/profiling.png)

#### 7. Now, you can use the registered information to optimize your application

How the optimizations works? 
The optimization removes the UFFs functions from the js file optimized. All the functions removed are listed in a folder created by the tool called "uff" in the same folder in which the optimized file is located. To avoid potential runtime errors owing to functions removed wrongly, UFFOptimizer replace the functions with an AJAX synchronous call that dinamically load the function from the server in case of need it.

> Note: The file to optimize needs to be the original file.

You can optimize your original file as follow.

	node [UFFO_path] optimize_file_browser [file_to_optimize] [profiling_file]

For Example:

	node ../../UFFOptimizer optimize_file_browser bundle.js profiling.txt

> This step generates a new file, e.g. bundle-optimized.js

In math.js example:

![image](https://github.com/hcvazquez/UFFOptimizer/blob/master/experiment/img/optimization.png)

#### 8. Test your optimization file

> Note: Please check that the application has access to the "uff" folder. The ajax call will try to load the functions from the root. The path to the file look like this: 	[AJAX_call] ('uff/$_-7697924661507122750048.js'). 

To test your optimized file you need to replace in your site the original file with the optimized file.

For Example:

Replace

	<script src="bundle.js"></script>

With

	<script src="bundle-optimized.js"></script>

In math.js example:

![image](https://github.com/hcvazquez/UFFOptimizer/blob/master/experiment/img/replace-optimized.png)
	

Also you can test the UFFs that were cropped from the bundle.

For example, in the math.js experiment you can try (in your page, or in the browser developer console):

	math.multiply(math.eye(1000, 1000, 'sparse'), math.eye(1000, 1000, 'sparse'));	
	
You should not see any error.

If you want to see that functions were loaded lazily, you must put in the browser developer console the code:

	window.uffs

![image](https://github.com/hcvazquez/UFFOptimizer/blob/master/experiment/img/testing-optimization.png)
