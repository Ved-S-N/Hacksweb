BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Event] DROP CONSTRAINT [Event_tags_df];
ALTER TABLE [dbo].[Event] ALTER COLUMN [organizerId] INT NULL;
ALTER TABLE [dbo].[Event] ADD CONSTRAINT [Event_tags_df] DEFAULT '[]' FOR [tags];
ALTER TABLE [dbo].[Event] ADD [banner] NVARCHAR(1000),
[longDescription] NVARCHAR(1000),
[rules] NVARCHAR(1000) NOT NULL CONSTRAINT [Event_rules_df] DEFAULT '[]';

-- CreateTable
CREATE TABLE [dbo].[Organizer] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [avatar] NVARCHAR(1000),
    [description] NVARCHAR(1000),
    [website] NVARCHAR(1000),
    CONSTRAINT [Organizer_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Track] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [prize] INT NOT NULL,
    [eventId] INT NOT NULL,
    CONSTRAINT [Track_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Timeline] (
    [id] INT NOT NULL IDENTITY(1,1),
    [time] NVARCHAR(1000) NOT NULL,
    [eventName] NVARCHAR(1000) NOT NULL,
    [date] NVARCHAR(1000) NOT NULL,
    [eventId] INT NOT NULL,
    CONSTRAINT [Timeline_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Sponsor] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [logo] NVARCHAR(1000) NOT NULL,
    [tier] NVARCHAR(1000) NOT NULL,
    [eventId] INT NOT NULL,
    CONSTRAINT [Sponsor_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Event] ADD CONSTRAINT [Event_organizerId_fkey] FOREIGN KEY ([organizerId]) REFERENCES [dbo].[Organizer]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Track] ADD CONSTRAINT [Track_eventId_fkey] FOREIGN KEY ([eventId]) REFERENCES [dbo].[Event]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Timeline] ADD CONSTRAINT [Timeline_eventId_fkey] FOREIGN KEY ([eventId]) REFERENCES [dbo].[Event]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Sponsor] ADD CONSTRAINT [Sponsor_eventId_fkey] FOREIGN KEY ([eventId]) REFERENCES [dbo].[Event]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
