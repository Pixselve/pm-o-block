# Migration `watch-20190623220943`

This migration has been generated at 6/23/2019, 10:09:45 PM.
You can check out the [state of the datamodel](./datamodel.prisma) after the migration.

## Database Steps

```sql
PRAGMA foreign_keys=OFF;

CREATE TABLE "lift"."new_User"("id" TEXT NOT NULL  ,"discordId" TEXT NOT NULL DEFAULT '' ,"joinDate" DATE NOT NULL  ,"messages" INTEGER NOT NULL DEFAULT 0 ,"verified" BOOLEAN NOT NULL DEFAULT false ,PRIMARY KEY ("id"));

INSERT INTO "new_User" ("id","discordId","joinDate","messages") SELECT "id","discordId","joinDate","messages" from "User"

DROP TABLE "lift"."User";

ALTER TABLE "lift"."new_User" RENAME TO "User";

PRAGMA "lift".foreign_key_check;

PRAGMA foreign_keys=ON;
```

## Changes

```diff
diff --git datamodel.mdl datamodel.mdl
migration watch-20190623215505..watch-20190623220943
--- datamodel.dml
+++ datamodel.dml
@@ -14,8 +14,9 @@
     discordId String  @unique
     joinDate DateTime   @default(now())
     warns Warn[]
     messages Int @default(0)
+    verified Boolean @default(false)
 }
 model Warn {
     id    String  @default(cuid()) @id @unique
     reason String
```

## Photon Usage

You can use a specific Photon built for this migration (watch-20190623220943)
in your `before` or `after` migration script like this:

```ts
import Photon from '@generated/photon/watch-20190623220943'

const photon = new Photon()

async function main() {
  const result = await photon.users()
  console.dir(result, { depth: null })
}

main()

```
