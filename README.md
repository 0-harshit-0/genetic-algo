# genetic algorithm
<b>special thaks to <a href="https://shiffman.net/">Daniel Shiffman</a> and his work <a href="https://thecodingtrain.com/learning/nature-of-code/">Nature of code</a>.</b><br><br>
In computer science and operations research, a genetic algorithm (GA) is a metaheuristic inspired by the process of natural selection that belongs to the larger class of evolutionary algorithms (EA). Genetic algorithms are commonly used to generate high-quality solutions to optimization and search problems by relying on biologically inspired operators such as mutation, crossover and selection.

process involved in genetic algorithm:-<br>
<ol>
<b>SETUP:</b>
  <li>Initialize. Create a population of N elements, each with randomly generated DNA.</li>
<b>LOOP:</b>
  <li>Selection. Evaluate the fitness of each element of the population and build a matingpool.</li>
  <li>Reproduction. Repeat N times:
    <ol type="a">
      <li>Pick two parents with probability according to relative fitness.</li>
      <li>Crossover—create a “child” by combining the DNA of these two parents.</li>
      <li>Mutation—mutate the child’s DNA based on a given probability.</li>
      <li>Add the new child to a new population.</li>
    </ol>
  </li>
  <li>Replace the old population with the new population and return to Step 2.</li>
</ol>
