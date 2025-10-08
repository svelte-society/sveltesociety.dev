update content set
  metadata = json_replace(metadata,'$.thumbnail', replace(metadata ->> '$.thumbnail', '//', '/'));

update content set
  metadata = json_replace(metadata,'$.thumbnail', replace(metadata ->> '$.thumbnail', '.html', '.png'));