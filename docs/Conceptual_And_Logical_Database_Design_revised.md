# Explain the assumptions for each entity and relationship in our model

## Entity Explanations  

### House Table
This table stores aggregated data about the housing market collected by Redfin. The attributes that create our composite primary key for this table are property\_type\_id, region, and period\_begin. 

The property\_type\_id is the type of properties considered, which consist of Single Family Residential, Townhouse, All Residential, Multi-Family (2-4 Unit), Condo/Co-op.

The region is the location of the houses. It consists of a City, State name. 

The period\_begin attribute is the date at which Redfin started collecting data about the houses. Redfin always collects data over the span of a month.

Thus every row in the house table is aggregated data about the **property\_type\_id** type of houses in the specific **region** between **period\_begin** and the end of the month.

The other attributes in the table are the median price houses were sold at (median\_sale\_price), the median price houses were listed at (median\_list\_price), the median sale price per square foot (median\_ppsf), the median list price per square foot (median\_list\_ppsf), the total number of houses sold (homes\_sold), the median ratio of sell price to list price (sold\_above\_list), the number of pending sales (pending\_sales), the number of new listings (new\_listings), the total number of homes available for sale (inventory), how long it would take to sell all the current homes on the market at the current pace of sales (months\_of\_supply) and the median days on market of houses that were sold (median\_dom).

### User Table
This table stores the data about users on this website. It includes the user\_id, user\_name and password (hashed). Every time a user sign up needs to store a new row into this table, so we create a new entity for this function.

### Location Table
This table stores the data about the location, it includes region, city, state, and parent\_metro\_region. The region can define which city, state, and metropolitan area it is located at. So, we separate this into a different entity so as to decrease the redundancy of our database design.

### User Requesting Table
This table allows users to submit requests to add, modify, or remove housing data. We store these values into a new entity because we have to handle the requests from users independently.

**report\_id**: The unique auto-incremented id of user request that serves as the primary key  
**user\_id**: The user\_id that requests the modification (Foreign Key to User.user\_id)  
**region**: The region that the user requests to modify (Foreign Key to Location.region)  
**property\_type** :  The type of property that the user requests to modify   
**sold\_price**:  The sold price of the property that the user requests to modify. Note that this value can be empty if the property user requests isn’t sold  
**list\_price**:  The list price of the property that the user requests to modify   
**list\_time**:  The list time of the property that the user requests to modify   
**sold\_time**:  The sold time of the property that the user requests to modify. Note that this value can be empty if the property user requests isn’t sold  
**square\_feet**: The size of the property (in square feet) that the user requests to modify 

### Favorite Queries Table
This table stores the user's favorite queries. Since the application allows users to query and visualize the housing data, this table can store queries that the user has favored so that they can easily re-materialize them. Users can query both the aggregated housing data provided by Redfin and stored in the House table and the self-reported granular data stored in the User Requesting Table.

**query\_id**: The unique auto-incremented id of the query that serves as the primary key  
**user\_Id**: The user\_id that favorited this query (Foreign Key to User.user\_id)  
**period\_begin**: The start date of the time range that the user is interested in querying over. Note that this is not the same as the period\_begin attribute in the House table  
**period\_end**: The end date of the time range that the user is interested in querying over. Note that this is not determined by period\_begin, as the user maybe interested in a time span of days, weeks, months or years.  
**location\_type**: The location type of the houses that the user is interested in. This can be City, State or Metro Region, letting users control the granularity of their queries.  
**location\_value**: The name of the City, State or Metro Region. Note that this value does not determine location\_type because New York is a city, state and metropolitan region,  
**property\_type\_id**: The type of properties that the user is interested in. This can be Single Family Residential, Townhouse, All Residential, Multi-Family (2-4 Unit) or Condo/Co-op  
**query\_type:** This is the type of data that the user is interested in. It can be attributes from the Housing or User Requesting Table or materialized data like turnover, liquidity etc.  
**visualization\_type**: The type of visualization the user is interested in for this query. Can include things like line charts, bar charts, histogram, pie charts, etc  
data\_type: The table that will be queried, either House table or User Requesting Table.

## Relationship Explanation  
### Location Table to House Table
This relationship is **one-many** because each house must be located at one specific region, and each region can have 0 to multiple houses.  
### Location Table to User Requesting Table
This relationship is **one-many** because each region 4by the user must be a location in the Location Table, and each region also can occur in 0 to multiple reports.  
### User Table to Favorite Queries Table
This relationship is **one-many** because each user might have several favorite queries but each queries can only be favorited by it own user  
### User Table to User Requesting Table
This relationship is **one-many** because each user can provide many property’s information.  
### User Requesting Table to User Table
This relationship is **many-many** because each user can add 0 to multiple reported data into its favorite list. Also, each data can be favored by 0 to multiple users on this app.

# Normalize (3NF)

Favorite Query Table:   
FD1:  
query\_id → user\_id, period\_begin, period\_end, location\_type, location\_value, property\_type\_id, query\_type, visualization\_type, data\_type

Minimal Basis:  
query\_id → user\_id, period\_begin, period\_end, location\_type, location\_value, property\_type\_id, query\_type, visualization\_type, data\_type

3NF decomp.:  
(query\_id, user\_id, period\_begin, period\_end, location\_type, location\_value, property\_type\_id, query\_type, visualization\_type, data\_type)

User Table:   
FD1:  
user\_id → user\_name, password

Minimal Basis:  
user\_id → user\_name, password

3NF decomp.:  
(user\_id, user\_name, password)

User Requesting Table:   
FD1:  
report\_id → user\_id, region, property\_type, sold\_price, list\_price, list\_time, sold\_time, square\_feet

Minimal Basis: 
report\_id → user\_id, region, property\_type, sold\_price, list\_price, list\_time, sold\_time, square\_feet

3NF decomp.:  
(report\_id, user\_id, region, property\_type, sold\_price, list\_price, list\_time, sold\_time, square\_feet)

Location Table:   
FD1:  
region → city, state, parent\_metro\_region

Minimal Basis:  
region → city, state, parent\_metro\_region

3NF decomp.:  
(region, city, state, parent\_metro\_region)

House Table:   
FD1:  
period\_begin \-\> period\_end  
FD2:  
property\_type\_id \-\> property\_type  
FD3:  
property\_type\_id, period\_begin, region → median\_sale\_price, median\_list\_price, median\_ppsf, median\_list\_ppsf, homes\_sold, sold\_above\_list, pending\_sales, new\_listings, inventory, months\_of\_supply, median\_dom  

Minimal Basis:  
period\_begin \-\> period\_end; property\_type\_id \-\> property\_type; property\_type\_id, period\_begin, region → median\_sale\_price, median\_list\_price, median\_ppsf, median\_list\_ppsf, homes\_sold, sold\_above\_list, pending\_sales, new\_listings, inventory, months\_of\_supply, median\_dom  

3NF decomp.:  
(period\_begin, period\_end), (property\_type\_id,  property\_type), (property\_type\_id, period\_begin, region,  median\_sale\_price, median\_list\_price, median\_ppsf, median\_list\_ppsf, homes\_sold, sold\_above\_list, pending\_sales, new\_listings, inventory, months\_of\_supply, median\_dom)

# Logical Design(relational schema)

Favorite Query Table  
	(  
query\_id: INT \[PK\]  
user\_Id: VARCHAR(50) \[FK to User.user\_id\]  
period\_begin: VARCHAR(10)  
period\_end: VARCHAR(10)  
location\_type: VARCHAR(5)  
location\_value: VARCHAR(255)  
property\_type\_id: VARCHAR(50)  
query\_type: VARCHAR(50)  
visualization\_type: VARCHAR(50)  
data\_type: VARCHAR(20)  
)

User Table  
(  
user\_name: VARCHAR(255)  
user\_id: VARCHAR(50) \[PK\]  
password: VARCHAR(50)  
)

User Requesting Table  
	(  
report\_id: INT \[PK\]  
user\_id: VARCHAR(50) \[FK to User.user\_id\]  
region: VARCHAR(50) \[FK to Location.region\]  
property\_type: VARCHAR(50)  
sold\_price: REAL   
list\_price: REAL  
list\_time: VARCHAR(10)  
sold\_time: VARCHAR(10)  
square\_feet: REAL  
)

Location Table  
	(  
region: VARCHAR(50) \[PK\]  
city: VARCHAR(50)  
state: VARCHAR(50)  
parent\_metro\_region: VARCHAR(50)  
)

House Table  
	(  
property\_type\_id: INT \[PK\] \[FK to Property\_Type.property\_type\_id\]  
period\_begin: VARCHAR(100) \[PK\] \[FK to Period.period\_begin\]  
region: VARCHAR(255) \[PK\] \[FK to Location.region\]  
median\_sale\_price: REAL  
median\_list\_price: REAL  
median\_ppsf: REAL  
median\_list\_ppsf: REAL  
homes\_sold: INT  
sold\_above\_list: REAL  
pending\_sales: INT  
new\_listings: INT  
inventory: INT  
months\_of\_supply: REAL  
median\_dom: REAL  
off\_market\_in\_two\_weeks: INT  
)

Period  
	(  
	period\_begin: VARCHAR(100) \[PK\]  
	period\_end: VARCHAR(100)  
	)

Property\_Type  
	(  
	property\_type\_id: INT \[PK\]  
	property\_type: VARCHAR(50)  
	)
