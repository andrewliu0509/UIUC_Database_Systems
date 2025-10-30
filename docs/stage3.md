# First query
### Find the city, time_period for median_sale_price < 700k for townhouses and <1M for residential in the last 3 years
```SQL
SELECT h.city, h.period_begin, h.period_end
FROM (
    (
    SELECT l2.city, h2.period_begin, h2.period_end
    FROM Location l2 NATURAL JOIN House h2
    WHERE h2.median_sale_price < 700000 AND h2.property_type = 'Townhouse'
    )
UNION
(
    SELECT l3.city, h3.period_begin, h3.period_end
    FROM Location l3 NATURAL JOIN House h3
    WHERE h3.median_sale_price < 1000000 AND h3.property_type = 'Residential'
    
)
) AS h
WHERE h.period_begin < DATE_SUB(CURDATE(), INTERVAL 3 YEAR)
LIMIT 15; 
```
### top 15 rows
![alt text](./img/image.png)

### explain analyze without index
![alt text](./img/image-1.png)

### index house_median_sale_price on House(median_sale_price)
![alt text](./img/image-2.png)

### index house_median_sale_price + house_property_type on House(median_sale_price, property_type)
![alt text](./img/image-3.png)

### index house_property_type on House(property_type)
![alt text](./img/image-4.png)

# Second query

### Find the city and time period with the highest median price per square foot price in America
```SQL
SELECT House.period_begin, House.period_end, Location.city
FROM House NATURAL JOIN Location
WHERE House.median_ppsf =
    (
        SELECT MAX(h2.median_ppsf)
        FROM House h2
    );
```
### top 15 rows
![alt text](./img/image-5.png)

### explain analyze without index
![alt text](./img/image-6.png)

### index house_median_ppsf on House(median_ppsf)
![alt text](./img/image-7.png)

### index location_city on Location(city)
![alt text](./img/image-8.png)

### index house_period_begin on House(period_begin)
![alt text](./img/image-9.png)

# Third query
### Find highest price of house in a metro area over a time span for Townhouse
```SQL
SELECT MAX(House.median_sale_price), Location.parent_metro_region
FROM House NATURAL JOIN Location
WHERE House.property_type = 'Townhouse'
AND House.period_begin >= '2010-01-01' AND House.period_end < '2020-01-01'
GROUP BY Location.parent_metro_region
LIMIT 15;
```
### top 15 rows
![alt text](./img/image-10.png)

### explain analyze without index
![alt text](./img/image-11.png)

### index house_property_type on House(property_type)
![alt text](./img/image-12.png)

### index location_parent_metro_region on Location(parent_metro_region);
![alt text](./img/image-13.png)

### index house_period_begin on House(period_begin);
![alt text](./img/image-14.png)

# Fourth query
### Find the city in each metropolitan area with the largest gap between median list price and median sale price in 2024
```SQL
SELECT L.parent_metro_region, L.city,
       AVG(H.median_list_price - H.median_sale_price) AS avg_price_gap
FROM House H
JOIN Location L ON H.region_id = L.region_id
WHERE H.period_begin >= '2024-01-01' AND H.period_end < '2025-01-01'
GROUP BY L.parent_metro_region, L.city
ORDER BY avg_price_gap DESC
LIMIT 15;
```
### top 15 rows

### explain analyze without index

### index

### index

### index