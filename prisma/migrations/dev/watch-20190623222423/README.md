# Migration `watch-20190623222423`

This migration has been generated at 6/23/2019, 10:24:25 PM.
You can check out the [state of the datamodel](./datamodel.prisma) after the migration.

## Database Steps

```sql
PRAGMA foreign_keys=OFF;

CREATE TABLE "lift"."new_Warn"("id" TEXT NOT NULL  ,"reason" TEXT NOT NULL DEFAULT '' ,"timestamp" DATE NOT NULL  ,"authorId" TEXT NOT NULL DEFAULT '' ,"target" TEXT NOT NULL  REFERENCES User(id),PRIMARY KEY ("id"));

INSERT INTO "new_Warn" ("id","reason","timestamp") SELECT "id","reason","timestamp" from "Warn"

DROP TABLE "lift"."Warn";

ALTER TABLE "lift"."new_Warn" RENAME TO "Warn";

PRAGMA "lift".foreign_key_check;

PRAGMA foreign_keys=ON;
```

## Changes

```diff
diff --git datamodel.mdl datamodel.mdl
migration watch-20190623220943..watch-20190623222423
--- datamodel.dml
+++ datamodel.dml
@@ -20,7 +20,7 @@
 model Warn {
     id    String  @default(cuid()) @id @unique
     reason String
     timestamp DateTime   @default(now())
-    author User
-    targetId String @unique
+    authorId String @unique
+    target User
 }
```

## Photon Usage

You can use a specific Photon built for this migration (watch-20190623222423)
in your `before` or `after` migration script like this:

```ts
import Photon from '@generated/photon/watch-20190623222423'

const photon = new Photon()

async function main() {
  const result = await photon.users()
  console.dir(result, { depth: null })
}

main()

```
