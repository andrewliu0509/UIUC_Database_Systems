DELIMITER //

CREATE PROCEDURE PriceRankings(
    IN pr_city VARCHAR(50),
    IN pr_state VARCHAR(50),
    IN pr_property_type_id INT,
    IN pr_period_start DATE,
    IN pr_period_end DATE,
    IN pr_metric VARCHAR(50)
)
BEGIN
    DECLARE var_avg_sale DOUBLE DEFAULT 0;
    DECLARE var_avg_list DOUBLE DEFAULT 0;
    DECLARE var_avg_spread DOUBLE DEFAULT 0;
    DECLARE var_volume DOUBLE DEFAULT 0;
    DECLARE var_metric_value DOUBLE DEFAULT 0;
    DECLARE var_rank_state INT DEFAULT 1;
    DECLARE var_rank_nation INT DEFAULT 1;
    DECLARE var_total_cities_state INT DEFAULT 0;
    DECLARE var_total_cities_nation INT DEFAULT 0;

    SELECT
        AVG(h.median_sale_price),
        AVG(h.median_list_price),
        AVG(h.median_sale_price - h.median_list_price),
        SUM(h.median_sale_price * h.homes_sold)
    INTO
        var_avg_sale, var_avg_list, var_avg_spread, var_volume
    FROM House h JOIN Location l ON h.region_id = l.region_id
    WHERE l.city = pr_city AND l.us_state = pr_state AND h.property_type_id = pr_property_type_id 
        AND h.period_begin >= pr_period_start AND h.period_begin <= pr_period_end;

    IF pr_metric = 'list_price' THEN
        SET var_metric_value = var_avg_list;
    ELSEIF pr_metric = 'spread' THEN
        SET var_metric_value = var_avg_spread;
    ELSEIF pr_metric = 'sales_volume' THEN
        SET var_metric_value = var_volume;
    ELSE
        SET var_metric_value = var_avg_sale; 
    END IF;

    SELECT COUNT(*) + 1
    INTO var_rank_state
    FROM (
        SELECT
            l.city,
            AVG(h.median_sale_price) AS avg_sale_price,
            AVG(h.median_list_price) AS avg_list_price,
            AVG(h.median_sale_price - h.median_list_price) AS avg_spread,
            SUM(h.median_sale_price * h.homes_sold) AS total_sales_volume
        FROM House h JOIN Location l ON h.region_id = l.region_id
        WHERE l.us_state = pr_state
            AND h.property_type_id = pr_property_type_id
            AND h.period_begin >= pr_period_start AND h.period_begin <= pr_period_end

        GROUP BY l.city
    ) st
    WHERE (pr_metric = 'list_price' AND st.avg_list_price > var_metric_value)
        OR (pr_metric = 'spread' AND st.avg_spread > var_metric_value)
        OR (pr_metric = 'sales_volume' AND st.total_sales_volume > var_metric_value)
        OR (pr_metric NOT IN ('list_price','spread','sales_volume') AND st.avg_sale_price > var_metric_value);

    SELECT COUNT(DISTINCT l.city)
    INTO var_total_cities_state
    FROM House h JOIN Location l ON h.region_id = l.region_id
    WHERE l.us_state = pr_state
        AND h.property_type_id = pr_property_type_id
        AND h.period_begin >= pr_period_start AND h.period_begin <= pr_period_end;

    SELECT COUNT(*) + 1
    INTO var_rank_nation
    FROM (
        SELECT
            l.city,
            l.us_state,
            AVG(h.median_sale_price) AS avg_sale_price,
            AVG(h.median_list_price) AS avg_list_price,
            AVG(h.median_sale_price - h.median_list_price) AS avg_spread,
            SUM(h.median_sale_price * h.homes_sold) AS total_sales_volume
        FROM House h JOIN Location l ON h.region_id = l.region_id
        WHERE h.property_type_id = pr_property_type_id
            AND h.period_begin >= pr_period_start AND h.period_begin <= pr_period_end
        GROUP BY l.city, l.us_state
    ) nt
    WHERE (pr_metric = 'list_price' AND nt.avg_list_price > var_metric_value)
        OR (pr_metric = 'spread' AND nt.avg_spread > var_metric_value)
        OR (pr_metric = 'sales_volume' AND nt.total_sales_volume > var_metric_value)
        OR (pr_metric NOT IN ('list_price','spread','sales_volume') AND nt.avg_sale_price > var_metric_value);

    SELECT COUNT(DISTINCT l.region_id)
    INTO var_total_cities_nation
    FROM House h JOIN Location l ON h.region_id = l.region_id
    WHERE h.property_type_id = pr_property_type_id
        AND h.period_begin >= pr_period_start AND h.period_begin <= pr_period_end;

    SELECT
    var_metric_value AS metric_value,
    var_rank_state   AS rank_in_state,
    var_total_cities_state AS total_cities_in_state,
    var_rank_nation  AS rank_in_nation,
    var_total_cities_nation AS total_cities_in_nation;

END//

DELIMITER ;
