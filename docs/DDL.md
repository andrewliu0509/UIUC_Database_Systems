```sql
create table User(
    user_name varchar(255),
    user_id varchar(50) Primary Key,
    user_password varchar(50)
);
```
```sql
create table Favorite_Query (
    query_id int Primary Key,
    user_id varchar(50),
    period_begin Date,
    period_end Date,
    location_type varchar(5),
    location_value varchar(255),
    property_type_id varchar(50),
    query_type varchar(50),
    visualization_type varchar(50),
    data_type varchar(20),
    Foreign Key (user_id) References User(user_id) ON DELETE CASCADE
);
```
```sql
create table Location(
    region_id int Primary Key,
    region varchar(50),
    city varchar(50),
    us_state varchar(50),
    parent_metro_region varchar(50)
);
```
```sql
create table User_Reporting(
    report_id int Primary Key,
    user_id varchar(50),
    region_id int,
    property_type varchar(50),
    sold_price real,
    list_price real,
    list_time Date,
    sold_time Date,
    square_feet real,
    Foreign Key (user_id) References User(user_id) ON DELETE CASCADE,
    Foreign Key (region_id) References Location(region_id) ON DELETE CASCADE
);
```
```sql
create table Favorites_Report(
    favorite_user_id varchar(50),
    reporting_user_id varchar(50),
    report_id int,
    Primary Key (favorite_user_id, reporting_user_id, report_id),
    Foreign Key (favorite_user_id) References User(user_id) ON DELETE CASCADE,
    Foreign Key (reporting_user_id) References User_Reporting(user_id) ON DELETE CASCADE,
    Foreign Key (report_id) References User_Reporting(report_id) ON DELETE CASCADE
);
```
```sql
create table House(
    property_type_id int,
    period_begin Date,
    region_id int,
    period_end Date,
    property_type varchar(50),
    median_sale_price real,
    median_list_price real,
    median_ppsf real,
    median_list_ppsf real,
    homes_sold int,
    sold_above_list real,
    pending_sales int,
    new_listings int,
    inventory int,
    months_of_supply real,
    median_dom real,
    off_market_in_two_weeks int,
    Primary Key (property_type_id, period_begin, region_id),
    Foreign Key (region_id) References Location(region_id) ON DELETE CASCADE
);
```