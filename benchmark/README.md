# UFFOptimizer Benchmark

This page list all the applications selected for the evaluation of our approach. All bundles (original and optimized) can be found in the OPTIMIZATION folder of the respective project (Example for messy, https://github.com/icpc17/UFFOptimizer/tree/master/benchmark/messy/OPTIMIZATION).

Additionally, we include two cvs files with more data. The file "Results data.cvs" details the set of applications, their characteristics and findings. Also, "Results data.cvs" contains the results of our approach and reports for each application the size of the minified bundle. On the other hand, "3party results.csv" shows the applications and the third-party applications that we use for a second validation test. 

##Feedback from the Developers

We submitted our optimized version of the application bundles to the developers responsible for those projects. We received responses from 9 of them (*chart.js, geojsonhint, unified, pixi.js, transform-pouch, mathjs, workfront-api, angular-countdown, * and *easystarjs*). We open issues in the github repositories so that any of the developers can reply. Our questionnaire model is as follows (Example for mathjs, https://github.com/josdejong/mathjs/issues/766)

>My name is Hernan; with a group of colleagues we are conducting a research about unused code present in dependencies of JavaScript projects. We call this functions, UFF (Unused foreign functions). We found that in most projects there exist a great amount of UFF that are being included in the final bundle.

>In the case of mathjs (v 3.5.1) our tools detected approximately 72 unused function in the dependencies. Removing those functions, the size of mathjs bundled could be reduced at least 2% (All tests passed). I replaced the bundled in several projects that use mathjs as loess, dn2a, dext and pullquoter. I’m attaching the reduced version of your project.
math(optimized).js

>I’ll be very grateful if you can answer me the following questions:
-Did you were aware of the existence of these unused functions in your projects?
-Do you think that this is a problem?
-Do you think that can be useful a tool for deal with this kind of problem?

>Thanks in advance.

>Cheers,

All the issues can be readed in the following links:
- https://github.com/chartjs/Chart.js/issues/2772#issuecomment-226116032
- https://github.com/mapbox/geojsonhint/issues/60#issuecomment-269017912
- https://github.com/wooorm/unified/issues/19#event-904273616
- https://github.com/pixijs/pixi.js/issues/3506#issuecomment-269036396
- https://github.com/nolanlawson/transform-pouch/issues/39#issuecomment-269036684
- https://github.com/josdejong/mathjs/issues/766#issuecomment-269076910
- https://github.com/Workfront/workfront-api/issues/17#issuecomment-269078567
- https://github.com/bendrucker/angular-countdown/issues/5#event-904306148
- https://github.com/prettymuchbryce/easystarjs/issues/45#issuecomment-269795766
