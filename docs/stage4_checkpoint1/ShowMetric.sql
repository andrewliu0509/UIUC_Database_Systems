DELIMITER //

CREATE PROCEDURE ShowMetric (
    IN sm_period_begin DATE,
    IN sm_period_end DATE,
    IN sm_location_type VARCHAR(5),   
    IN sm_location_value VARCHAR(255),
    IN sm_property_type VARCHAR(50),
    IN sm_query_type VARCHAR(50)
)
BEGIN
    IF sm_location_type = 'state' THEN
        IF sm_query_type = 'median_sale_price' THEN
            SELECT
                h.period_begin,
                h.period_end,
                l.us_state,
                h.property_type,
                h.median_sale_price 
            FROM House h NATURAL JOIN Location l
            WHERE h.period_begin >= sm_period_begin AND h.period_end <= sm_period_end 
                AND l.us_state = sm_location_value AND h.property_type = sm_property_type
            ORDER BY h.period_begin;

        ELSEIF sm_query_type = 'median_list_price' THEN
            SELECT
                h.period_begin,
                h.period_end,
                l.us_state,
                h.property_type,
                h.median_list_price 
            FROM House h NATURAL JOIN Location l
            WHERE h.period_begin >= sm_period_begin AND h.period_end <= sm_period_end 
                AND l.us_state = sm_location_value AND h.property_type = sm_property_type
            ORDER BY h.period_begin;

        ELSEIF sm_query_type = 'median_ppsf' THEN
            SELECT
                h.period_begin,
                h.period_end,
                l.us_state,
                h.property_type,
                h.median_ppsf 
            FROM House h NATURAL JOIN Location l
            WHERE h.period_begin >= sm_period_begin AND h.period_end <= sm_period_end 
                AND l.us_state = sm_location_value AND h.property_type = sm_property_type
            ORDER BY h.period_begin;

        ELSEIF sm_query_type = 'median_list_ppsf' THEN
            SELECT
                h.period_begin,
                h.period_end,
                l.us_state,
                h.property_type,
                h.median_list_ppsf 
            FROM House h NATURAL JOIN Location l
            WHERE h.period_begin >= sm_period_begin AND h.period_end <= sm_period_end 
                AND l.us_state = sm_location_value AND h.property_type = sm_property_type
            ORDER BY h.period_begin;

        ELSEIF sm_query_type = 'homes_sold' THEN
            SELECT
                h.period_begin,
                h.period_end,
                l.us_state,
                h.property_type,
                h.homes_sold 
            FROM House h NATURAL JOIN Location l
            WHERE h.period_begin >= sm_period_begin AND h.period_end <= sm_period_end 
                AND l.us_state = sm_location_value AND h.property_type = sm_property_type
            ORDER BY h.period_begin;

        ELSEIF sm_query_type = 'new_listings' THEN
            SELECT
                h.period_begin,
                h.period_end,
                l.us_state,
                h.property_type,
                h.new_listings 
            FROM House h NATURAL JOIN Location l
            WHERE h.period_begin >= sm_period_begin AND h.period_end <= sm_period_end 
                AND l.us_state = sm_location_value AND h.property_type = sm_property_type
            ORDER BY h.period_begin;

        ELSEIF sm_query_type = 'inventory' THEN
            SELECT
                h.period_begin,
                h.period_end,
                l.us_state,
                h.property_type,
                h.inventory 
            FROM House h NATURAL JOIN Location l
            WHERE h.period_begin >= sm_period_begin AND h.period_end <= sm_period_end 
                AND l.us_state = sm_location_value AND h.property_type = sm_property_type
            ORDER BY h.period_begin;
        END IF;

    ELSEIF sm_location_type = 'metro' THEN

        IF sm_query_type = 'median_sale_price' THEN
            SELECT
                h.period_begin, 
                h.period_end,
                l.parent_metro_region,
                h.property_type,
                h.median_sale_price
            FROM House h NATURAL JOIN Location l
            WHERE h.period_begin >= sm_period_begin AND h.period_end <= sm_period_end
                AND l.parent_metro_region = sm_location_value AND h.property_type = sm_property_type
            ORDER BY h.period_begin;

        ELSEIF sm_query_type = 'median_list_price' THEN
            SELECT
                h.period_begin, 
                h.period_end,
                l.parent_metro_region,
                h.property_type,
                h.median_list_price
            FROM House h NATURAL JOIN Location l
            WHERE h.period_begin >= sm_period_begin AND h.period_end <= sm_period_end
                AND l.parent_metro_region = sm_location_value AND h.property_type = sm_property_type
            ORDER BY h.period_begin;

        ELSEIF sm_query_type = 'median_ppsf' THEN
            SELECT
                h.period_begin, 
                h.period_end,
                l.parent_metro_region,
                h.property_type,
                h.median_ppsf
            FROM House h NATURAL JOIN Location l
            WHERE h.period_begin >= sm_period_begin AND h.period_end <= sm_period_end
                AND l.parent_metro_region = sm_location_value AND h.property_type = sm_property_type
            ORDER BY h.period_begin;

        ELSEIF sm_query_type = 'median_list_ppsf' THEN
            SELECT
                h.period_begin, 
                h.period_end,
                l.parent_metro_region,
                h.property_type,
                h.median_list_ppsf
            FROM House h NATURAL JOIN Location l
            WHERE h.period_begin >= sm_period_begin AND h.period_end <= sm_period_end
                AND l.parent_metro_region = sm_location_value AND h.property_type = sm_property_type
            ORDER BY h.period_begin;

        ELSEIF sm_query_type = 'homes_sold' THEN
            SELECT
                h.period_begin, 
                h.period_end,
                l.parent_metro_region,
                h.property_type,
                h.homes_sold
            FROM House h NATURAL JOIN Location l
            WHERE h.period_begin >= sm_period_begin AND h.period_end <= sm_period_end
                AND l.parent_metro_region = sm_location_value AND h.property_type = sm_property_type
            ORDER BY h.period_begin;

        ELSEIF sm_query_type = 'new_listings' THEN
            SELECT
                h.period_begin, 
                h.period_end,
                l.parent_metro_region,
                h.property_type,
                h.new_listings
            FROM House h NATURAL JOIN Location l
            WHERE h.period_begin >= sm_period_begin AND h.period_end <= sm_period_end
                AND l.parent_metro_region = sm_location_value AND h.property_type = sm_property_type
            ORDER BY h.period_begin;

        ELSEIF sm_query_type = 'inventory' THEN
            SELECT
                h.period_begin, 
                h.period_end,
                l.parent_metro_region,
                h.property_type,
                h.inventory
            FROM House h NATURAL JOIN Location l
            WHERE h.period_begin >= sm_period_begin AND h.period_end <= sm_period_end
                AND l.parent_metro_region = sm_location_value AND h.property_type = sm_property_type
            ORDER BY h.period_begin;
        END IF;
        
    ELSE

        IF sm_query_type = 'median_sale_price' THEN
            SELECT
                h.period_begin, 
                h.period_end,
                l.region,
                h.property_type,
                h.median_sale_price
            FROM House h NATURAL JOIN Location l
            WHERE h.period_begin >= sm_period_begin AND h.period_end <= sm_period_end
                AND l.region = sm_location_value AND h.property_type = sm_property_type
            ORDER BY h.period_begin;

        ELSEIF sm_query_type = 'median_list_price' THEN
            SELECT
                h.period_begin, 
                h.period_end,
                l.region,
                h.property_type,
                h.median_list_price
            FROM House h NATURAL JOIN Location l
            WHERE h.period_begin >= sm_period_begin AND h.period_end <= sm_period_end
                AND l.region = sm_location_value AND h.property_type = sm_property_type
            ORDER BY h.period_begin;

        ELSEIF sm_query_type = 'median_ppsf' THEN
            SELECT
                h.period_begin, 
                h.period_end,
                l.region,
                h.property_type,
                h.median_ppsf
            FROM House h NATURAL JOIN Location l
            WHERE h.period_begin >= sm_period_begin AND h.period_end <= sm_period_end
                AND l.region = sm_location_value AND h.property_type = sm_property_type
            ORDER BY h.period_begin;

        ELSEIF sm_query_type = 'median_list_ppsf' THEN
            SELECT
                h.period_begin, 
                h.period_end,
                l.region,
                h.property_type,
                h.median_list_ppsf
            FROM House h NATURAL JOIN Location l
            WHERE h.period_begin >= sm_period_begin AND h.period_end <= sm_period_end
                AND l.region = sm_location_value AND h.property_type = sm_property_type
            ORDER BY h.period_begin;

        ELSEIF sm_query_type = 'homes_sold' THEN
            SELECT
                h.period_begin, 
                h.period_end,
                l.region,
                h.property_type,
                h.homes_sold
            FROM House h NATURAL JOIN Location l
            WHERE h.period_begin >= sm_period_begin AND h.period_end <= sm_period_end
                AND l.region = sm_location_value AND h.property_type = sm_property_type
            ORDER BY h.period_begin;

        ELSEIF sm_query_type = 'new_listings' THEN
            SELECT
                h.period_begin, 
                h.period_end,
                l.region,
                h.property_type,
                h.new_listings
            FROM House h NATURAL JOIN Location l
            WHERE h.period_begin >= sm_period_begin AND h.period_end <= sm_period_end
                AND l.region = sm_location_value AND h.property_type = sm_property_type
            ORDER BY h.period_begin;
        ELSEIF sm_query_type = 'inventory' THEN
            SELECT
                h.period_begin, 
                h.period_end,
                l.region,
                h.property_type,
                h.inventory
            FROM House h NATURAL JOIN Location l
            WHERE h.period_begin >= sm_period_begin AND h.period_end <= sm_period_end
                AND l.region = sm_location_value AND h.property_type = sm_property_type
            ORDER BY h.period_begin;

        END IF;
    END IF;
END//

DELIMITER ;
