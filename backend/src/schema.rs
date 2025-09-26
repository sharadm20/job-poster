
// @generated automatically by Diesel CLI.
diesel::table! {
    applications (id) {
        id -> Uuid,
        user_id -> Nullable<Uuid>,
        job_id -> Nullable<Uuid>,
        resume_id -> Nullable<Uuid>,
        cover_letter -> Nullable<Text>,
        status -> Nullable<Text>,
        meta -> Nullable<Jsonb>,
        created_at -> Timestamptz,
    }
}

diesel::table! {
    jobs (id) {
        id -> Uuid,
        source -> Nullable<Text>,
        remote_id -> Nullable<Text>,
        title -> Nullable<Text>,
        company -> Nullable<Text>,
        location -> Nullable<Text>,
        posting_url -> Nullable<Text>,
        raw_payload -> Nullable<Jsonb>,
        discovered_at -> Timestamptz,
    }
}

diesel::table! {
    resumes (id) {
        id -> Uuid,
        user_id -> Nullable<Uuid>,
        uploaded_at -> Timestamptz,
        text -> Nullable<Text>,
        parsed -> Nullable<Jsonb>,
        filename -> Nullable<Text>,
    }
}

diesel::table! {
    users (id) {
        id -> Uuid,
        email -> Text,
        hashed_password -> Nullable<Text>,
        created_at -> Timestamptz,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    applications,
    jobs,
    resumes,
    users,
);
