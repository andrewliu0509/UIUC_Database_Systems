### 1. Project Title: RobinSpot
Slogan: Where Every Robin Spots Its Nest

### 2. Project Summary 
RobinSpot is a real estate analytics platform that helps not only home buyers but also investors gain a better understanding of US housing market trends. The dataset this project uses contains both historical and current data on supply, demand, prices, and location of units across the country. Therefore, we can show current prices on a heatmap and provide different analytical metrics such as price growth rate, turnover rate, and liquidity index for users to query, and present the analytics in an interactive format.

### 3. Description of RobinSpot
The problem that our service aims to solve is while platforms like [Renvify](https://app.reinvify.com/map) provide housing market data, they only focus on showing the collected data. They don’t offer more advanced analytical tools. Thus, it may be challenging for people to understand the hidden meaning behind the data they see. By providing economic metrics, filtering options, and introducing interactive interfaces, we allow users to not only view data but also understand and analyze it in a digestible manner. 

### 4. Creative Components
We will include different graphs that help us visualize the relations. For data involving time, we include interactive a line time series graph, and for comparison among cities, we can include pie charts. In addition, to display geographic data, we will display heat maps. Some reference images are shown below:
  
![My_picture](/docs/img/Cs411%20Ideas%20w%20heart-9.jpg)
![My_picture](/docs/img/Cs411%20Ideas%20w%20heart-8.jpg)

### 5. Usefulness
The key functions of our application are the following:
 - Show detailed numbers regarding the price, houses listing, house sold, and other relevant information (Other similar websites also do this).
 - Introduce analytical tools that calculate various economic metrics (growth, liquidity, turnover).
 - Comparison tools that show the ranking and differences among cities.
 - Forecast tools that project future trends based on historical data and trends. (Other similar websites don’t do this).
 - Users can then save their favorite queries.
   - When favoriting their query, we will create a row on the user favorites table on the backend that remembers the parameters of the user’s queries.
   - The user can then manage their favorited queries on a query management page, including updating and deleting their queries.

### 6. Realness
The housing data is from Redfin, hosted by Kaggle ([data link](https://www.kaggle.com/datasets/vincentvaseghi/us-cities-housing-market-data/data)). This data is in tsv format with over 50 columns and with 2.88 GB. It captures location, prices, time period, number of houses sold, number of houses currently on the market and more, allowing for modeling the complex relations that can be captured by a SQL Database.

### 7. Detailed Description of Functionality
 - A clear list of the functionality:
    1. Users can type the desired location and time (Or use the interactive map and toggles) to query the basic information they want to retrieve.
    2. Users can click on a set of economic metrics related buttons after selecting the location and time period. After clicking, they’ll get the calculated data.
    3. If users click on multiple cities in a certain time period, they can compare the differences between those cities.
    4. Users can click on a prediction button and it’ll return forecasted data (user must select time and location first).
    5. Users can favorite queries to easily see a dashboard that they are interested in, so that they can track changes in the market.
- a low-fidelity UI mockup:
   ![My_picture](/docs/img/Cs411%20Ideas%20w%20heart-2.jpg)
   ![My_picture](/docs/img/Cs411%20Ideas%20w%20heart-3.jpg)
   ![My_picture](/docs/img/Cs411%20Ideas%20w%20heart-4.jpg)
   ![My_picture](/docs/img/Cs411%20Ideas%20w%20heart-5.jpg)
   ![My_picture](/docs/img/Cs411%20Ideas%20w%20heart-6.jpg)
   ![My_picture](/docs/img/Cs411%20Ideas%20w%20heart-7.jpg)
   ![My_picture](/docs/img/Cs411%20Ideas%20w%20heart-8.jpg)
   ![My_picture](/docs/img/Cs411%20Ideas%20w%20heart-9.jpg)
   ![My_picture](/docs/img/Cs411%20Ideas%20w%20heart-10.jpg)

### 8. Distribution
1. User signup/login and favorite queries and backend systems, and also will handle creating pie charts for visualization
2. Map visualization systems focusing on heat map, as well as writing the functionality to create the growth heat map
3. Data pre-processing (moving from tsv into the SQL database) and prediction feature, as well as setup the barebones website (landing page, header etc)
4. Add functionality on the setup map (e.g. add the searching bar function, add the filter year period function, etc.) create time series line chart, as well functionality to create turnover, growth and liquidity SQL queries.

