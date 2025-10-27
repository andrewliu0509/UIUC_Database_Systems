# Stage2 Revision
## UML diagram revision (UML_diagram.pdf v.s. UML_diagram_revised.pdf)
- After reading TA's comment, we've changed Favorite Queries from strong entity to weak entity. The main reason is that different person can have the same favorite query so that we need one more identifier, which is user_id here, to determine the uniqueness of each query. 
- Also, the user reporting entity was also changed into weak entity. The reason is similar to first point, reported data must be made by one user, so it can't exist independently from user.

## BCNF revision (Conceptual_And_Logical_Database_Design.md v.s. Conceptual_And_Logical_Database_Design_revised.md)
- We decide to use 3NF instead of using BCNF for our normalization part. And we will show the process of how we done 3NF.  
