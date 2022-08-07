-- AlterTable
CREATE SEQUENCE "anomaly_id_seq";
ALTER TABLE "Anomaly" ALTER COLUMN "id" SET DEFAULT nextval('anomaly_id_seq');
ALTER SEQUENCE "anomaly_id_seq" OWNED BY "Anomaly"."id";
