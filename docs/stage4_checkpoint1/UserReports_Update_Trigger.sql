DELIMITER $$

CREATE TRIGGER check_user_report_update
BEFORE UPDATE ON User_Reporting
FOR EACH ROW
BEGIN  
    IF NEW.sold_price < 0 OR NEW.list_price < 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Price cannot be negative';
    END IF;

    IF NEW.sold_time > NOW() OR NEW.list_time > NOW() THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Time cannot be in the future';
    END IF;

    IF NEW.sold_time < NEW.list_time THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Sold time cannot be before list time';
    END IF;

    IF NEW.square_feet <= 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Square feet must be positive';
    END IF;
END$$

DELIMITER ;