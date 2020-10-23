<<<<<<< HEAD
# web-theremin

You can test by loading `index.html` in a browser. Copy the ID that appears and open `index.html?peer=<ID>` (replace <ID> with the ID you copied). Moving your mouse within one tab will produce logs on the other tab!
=======
# Quasi-Key Tableaux

Given a weak composition, a sample _quasi-key_ tableau is produced, along with
some other information about the weak composistion.

Some code for [https://arxiv.org/abs/2007.09238](https://arxiv.org/abs/2007.09238)
and [https://arxiv.org/abs/2007.09229](https://arxiv.org/abs/2007.09229).

## Usage

The core logic is found in the [qkt-server](qkt-server/) folder.
This application heavily relies on
[Google OR-Tools](https://developers.google.com/optimization), specifically
the [CP-SAT Solver](https://developers.google.com/optimization/cp/cp_solver).
View the [Dockerfile](qkt-server/Dockerfile) to see how to `pip install`
the necessary libraries.

### Screenshot
![An example quasi-key tableau](assets/pic.png)
>>>>>>> Baseline.
