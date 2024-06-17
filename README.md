# Deidril's Pathfinder 1 PDF Import
This foundry vtt plugin allows to import PDFs into the current world. 

# Last release : Deidril's Pathfinder 1 PDF Import v3.04

For Foundry V11 only. It has not been tested on Foundry V12.

This is a migration of the import datas to the new import engine used since a few months for the Starfinder import module.

There are no game breaking changes and you don't need to reimport Crypt of the Everflame. 
Some things has been fixed here and there. The resulting journals should have a little better look, but that's all.

Changes are mainly internal and hidden to support incoming features or starfinder related stuff, but it was
necessary to do this migration to use the incoming foundry v12 compatible version. 

# Licenses
helyx.bundle.js code is under the MIT license
pdf.worker.min.js code is under the apache license

images in ~/datas/images are generated through Midjourney by Deidril, and are copyrighted (c) Deidril as far as AI generated content could be. Their use is restricted to this module scope.


# Supported PDFs 

## Adventures
- Crypt of the Everflame

# Known issues

      + Initial import of images may freeze foundry for up to a minute
      + Sometimes the import just fail after importing images. Cancel and retry.

      + Gender of creatures using the stat block of another creature, aren't set. Issue is on the todo list"
      + Foundry ids of imported entries are not static. Entries will not be correctly overwritten if you reimport the PDF.

# Installation
1. Install the plugin from the following url ; https://github.com/deidril/pf1-pdf-en-import/releases/latest/download/module.json
2. Start your Pathfinder 1 world, then activates the module 'Deidril's Pathfinder 1 PDF Import'
3. In the settings menu, click on 'Helyx - Import PDF'
![Settings](/img/click_helyx.png)
4. In the dialog box, click on 'PDF file' and select a supported PDF
![Dialog](/img/dialog.png)
5. Click on 'Import PDF' 
6. After all pages have been memorized, the module will identify which adventure it is and start the import
7. When import is completed, click on OK
8. Enjoy Pathfinder 1 !

