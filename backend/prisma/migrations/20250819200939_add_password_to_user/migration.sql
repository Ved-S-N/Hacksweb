/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_role_df] DEFAULT 'participant' FOR [role];
ALTER TABLE [dbo].[User] ADD [isEmailVerified] BIT NOT NULL CONSTRAINT [User_isEmailVerified_df] DEFAULT 0,
[password] NVARCHAR(1000) NOT NULL,
[resetToken] NVARCHAR(1000),
[resetTokenExpiry] DATETIME2,
[updatedAt] DATETIME2 NOT NULL,
[verificationToken] NVARCHAR(1000);

-- CreateTable
CREATE TABLE [dbo].[Session] (
    [id] INT NOT NULL IDENTITY(1,1),
    [token] NVARCHAR(1000) NOT NULL,
    [userId] INT NOT NULL,
    [expiresAt] DATETIME2 NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Session_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Session_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Session_token_key] UNIQUE NONCLUSTERED ([token])
);

-- AddForeignKey
ALTER TABLE [dbo].[Session] ADD CONSTRAINT [Session_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
