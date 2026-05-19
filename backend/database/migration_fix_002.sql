-- migration_fix_002.sql
-- Run this in phpMyAdmin to add video support to gallery items

ALTER TABLE gallery_items 
ADD COLUMN media_type ENUM('image', 'video') DEFAULT 'image' AFTER category,
ADD COLUMN video_url VARCHAR(255) NULL AFTER image_url;

-- Update services table to include video_url, suitable_for, benefits, process, faq
ALTER TABLE services
ADD COLUMN video_url VARCHAR(255) NULL AFTER image_url,
ADD COLUMN suitable_for TEXT NULL AFTER detail_description,
ADD COLUMN benefits TEXT NULL AFTER suitable_for,
ADD COLUMN process TEXT NULL AFTER benefits,
ADD COLUMN faq TEXT NULL AFTER process;
