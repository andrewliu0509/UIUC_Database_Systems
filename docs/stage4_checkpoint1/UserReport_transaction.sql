SET @duplicate_report = 0;
SET @avg_sale_price = 0;
SET @reg_id = 3;
SET @s_feet = 20;
SET @s_price = 500000;

START TRANSACTION;

-- check whether it has been reported by the same person and need to have name start begin with "A"
SELECT COUNT(*) INTO @duplicate_report
FROM User_Reporting u
WHERE EXISTS (
    SELECT 1
    FROM User_Reporting u2
    JOIN User u3 ON u2.user_id = u3.user_id
    WHERE u2.region_id = @reg_id
      AND u2.square_feet = @s_feet
      AND u2.sold_price = @s_price
      AND u3.user_name LIKE 'A%'
);

-- remove outlier data, so report that is too expensive cant insert into the table
SELECT AVG(h.median_sale_price) INTO @avg_sale_price
FROM Location l
JOIN House h ON l.region_id = h.region_id
WHERE l.region_id = @reg_id
GROUP BY l.region_id;

INSERT INTO User_Reporting(report_id, user_id, region_id, property_type, sold_price, list_price, list_time, sold_time, square_feet)
SELECT 105, 'al19', @reg_id, 'Townhouse', @s_price, 4000000, '2014-04-04', '2020-04-04', @s_feet
WHERE @duplicate_report = 0 AND @avg_sale_price * 10 >= @s_price;

COMMIT;
