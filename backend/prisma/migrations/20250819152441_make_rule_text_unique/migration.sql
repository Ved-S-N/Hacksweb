/*
  Warnings:

  - A unique constraint covering the columns `[text]` on the table `Rule` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateIndex
ALTER TABLE [dbo].[Rule] ADD CONSTRAINT [Rule_text_key] UNIQUE NONCLUSTERED ([text]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
