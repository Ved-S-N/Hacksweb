/*
  Fixed migration:
  - Drop default constraints before dropping columns
  - Properly list columns in DROP COLUMN
*/

BEGIN TRY
BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Event] DROP CONSTRAINT [Event_organizerId_fkey];

-- Drop default constraints for Event table (if they exist)
IF OBJECT_ID('Event_createdAt_df', 'D') IS NOT NULL
    ALTER TABLE [dbo].[Event] DROP CONSTRAINT [Event_createdAt_df];
IF OBJECT_ID('Event_rules_df', 'D') IS NOT NULL
    ALTER TABLE [dbo].[Event] DROP CONSTRAINT [Event_rules_df];
IF OBJECT_ID('Event_tags_df', 'D') IS NOT NULL
    ALTER TABLE [dbo].[Event] DROP CONSTRAINT [Event_tags_df];

-- Alter Event
ALTER TABLE [dbo].[Event] DROP CONSTRAINT [Event_endDate_df],
[Event_location_df],
[Event_startDate_df];

ALTER TABLE [dbo].[Event] ALTER COLUMN [organizerId] INT NOT NULL;
ALTER TABLE [dbo].[Event] ALTER COLUMN [location] NVARCHAR(1000) NULL;

-- Drop the old columns
ALTER TABLE [dbo].[Event] DROP COLUMN [createdAt], [prize], [rules], [tags];

-- Alter Sponsor
ALTER TABLE [dbo].[Sponsor] DROP COLUMN [logo], [tier];

-- Alter Timeline
ALTER TABLE [dbo].[Timeline] ALTER COLUMN [date] DATETIME2 NOT NULL;
ALTER TABLE [dbo].[Timeline] DROP COLUMN [eventName], [time];
ALTER TABLE [dbo].[Timeline] ADD [phase] NVARCHAR(1000) NOT NULL;

-- Alter Track
ALTER TABLE [dbo].[Track] DROP COLUMN [prize];

-- Create Tag
CREATE TABLE [dbo].[Tag] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Tag_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Tag_name_key] UNIQUE NONCLUSTERED ([name])
);

-- Create EventTag
CREATE TABLE [dbo].[EventTag] (
    [eventId] INT NOT NULL,
    [tagId] INT NOT NULL,
    CONSTRAINT [EventTag_pkey] PRIMARY KEY CLUSTERED ([eventId],[tagId])
);

-- Create Rule
CREATE TABLE [dbo].[Rule] (
    [id] INT NOT NULL IDENTITY(1,1),
    [text] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Rule_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- Create EventRule
CREATE TABLE [dbo].[EventRule] (
    [eventId] INT NOT NULL,
    [ruleId] INT NOT NULL,
    CONSTRAINT [EventRule_pkey] PRIMARY KEY CLUSTERED ([eventId],[ruleId])
);

-- Re-add foreign keys
ALTER TABLE [dbo].[Event] ADD CONSTRAINT [Event_organizerId_fkey] FOREIGN KEY ([organizerId]) REFERENCES [dbo].[Organizer]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE [dbo].[EventTag] ADD CONSTRAINT [EventTag_eventId_fkey] FOREIGN KEY ([eventId]) REFERENCES [dbo].[Event]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE [dbo].[EventTag] ADD CONSTRAINT [EventTag_tagId_fkey] FOREIGN KEY ([tagId]) REFERENCES [dbo].[Tag]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE [dbo].[EventRule] ADD CONSTRAINT [EventRule_eventId_fkey] FOREIGN KEY ([eventId]) REFERENCES [dbo].[Event]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE [dbo].[EventRule] ADD CONSTRAINT [EventRule_ruleId_fkey] FOREIGN KEY ([ruleId]) REFERENCES [dbo].[Rule]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
    BEGIN
        ROLLBACK TRAN;
    END;
    THROW
END CATCH
