SET SQL_SAFE_UPDATES = 0;
delete from sys_order_item;
delete from sys_payment;
delete from sys_feedback;
delete from sys_order;
delete from sys_reservation;
delete from sys_order_group;
delete from sys_notification_users;
delete from sys_notification;
delete from user_access_tokens;
delete from user_refresh_tokens;
delete from sys_user;


update sys_table
set status = 0;