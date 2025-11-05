update content set slug = slug || '-' || lower(id);

create trigger content___set_slug after insert on content begin
  update content set
    slug = slug || '-' || lower(new.id)
  where id = new.id;
end;