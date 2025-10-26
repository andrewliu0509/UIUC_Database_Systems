# Stage2 Revision
## UML diagram revision (UML_diagram.pdf v.s. UML_diagram_revised.pdf)
- After reading TA's comment, we've changed Favorite Queries from strong entity to weak entity. The main reason is that different person can have the same favorite query so that we need one more identifier, which is user_id here, to determine the uniqueness of each query. 
- Also, the user reporting entity was also changed into weak entity. The reason is similar to first point, reported data must be made my one user, so it can't exist independently from user.
- The third part I've changed is the relation between user and housing entity. In original version, there is no relationship between them; however, there does exist a "request-reply" relationship between the user table and the housing table. Additionally, we intentionally not to construct a new table to record each queries between these two tables. The reason is that we thought this table will be very space consuming and meaningless.

## BCNF revision (Conceptual_And_Logical_Database_Design.md v.s. Conceptual_And_Logical_Database_Design_revised.md)
- We decide to use 3NF instead of using BCNF for our normalization part. And we will show the process of how we done 3NF.  
