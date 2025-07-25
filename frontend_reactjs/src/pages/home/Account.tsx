import styled from "styled-components";
import { Check, Download, Upload } from "@mui/icons-material";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useBackupData, useCurrentUser, useEditUser, useRestoreData } from "../../api";
import { Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { ConfirmRestoreDialog } from "../../components";

const dataTypes: {
  [key: string]: string;
} = {
  expenses: "Expenses",
  diary: "Diary",
  notes: "Notes",
  piano: "Piano Pieces",
  hikes: "Hikes",
  "video-games": "Video Games"
};

const BackupButton = ({
  dataType
}: {
  dataType: string;
}) => {
  const { mutate: backupData, isPending } = useBackupData();

  const text = dataType === 'all' ? 'All Data' : "";

  return (
    <Button
      variant="outlined"
      loading={isPending}
      sx={{ flexGrow: 1 }}
      startIcon={<Download />}
      onClick={() => backupData({ dataType })}
    >
      Back Up {text}
    </Button>
  )
}

const RestoreButton = ({
  dataType
}: {
  dataType: string;
}) => {
  const { mutate: restoreData, isPending, isSuccess } = useRestoreData();

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const text = dataType === 'all' ? 'All Data' : "";

  return (
    <Fragment>
      {isSuccess && (
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}>
          <Check color="success" />
          <Typography
            variant="body2"
            color="success"
          >
            Restored!
          </Typography>
        </Box>
      )}
      {!isSuccess && (
        <input
          type="file"
          accept=".json"
          disabled={isPending}
          style={{ display: "none" }}
          id={`restore-${dataType}-upload`}
          onChange={(e) => setConfirmDialogOpen(true)}
        />
      )}
      {!isSuccess && (
        <label htmlFor={`restore-${dataType}-upload`} style={{ flexGrow: 1 }}>
          <Button
            variant="contained"
            component="span"
            startIcon={<Upload />}
            loading={isPending}
            sx={{ width: '100%' }}
          >
            Restore {text}
          </Button>
        </label>
      )}
      <ConfirmRestoreDialog
        dataType={dataType}
        restoreFn={() => {
          const input = document.getElementById(`restore-${dataType}-upload`) as HTMLInputElement;
          const file = input?.files?.[0];
          if (!file) return;
          const formData = new FormData();
          formData.append('file', file);
          restoreData({ dataType, formData });
        }}
        isOpen={confirmDialogOpen}
        setIsOpen={setConfirmDialogOpen}
      />
    </Fragment>
  )
}

export const Account = () => {

  const { data: user } = useCurrentUser()
  const { mutate: editUser, isPending: editUserLoading } = useEditUser();

  const [name, setName] = useState(user?.name ?? "")
  const [email, setEmail] = useState(user?.email ?? "");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [JSON.stringify(user)]);

  return (
    <Wrapper>
      <Grid container spacing={{ xs: 6, md: 4 }} flexGrow={1}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h5" gutterBottom>
              Account
            </Typography>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => editUser({
                name: name.trim(),
                email: email.trim()
              })}
              loading={editUserLoading}
            >
              Save Changes
            </Button>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography variant="h5" gutterBottom>Back Up & Restore Data</Typography>

            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
              <BackupButton dataType="all" />
              <RestoreButton dataType="all" />
            </Box>

            <Grid container spacing={2}>
              {Object.entries(dataTypes).map(([dataType, displayedValue]) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4, xl: 3 }} key={dataType}>
                  <Box
                    component={"fieldset"}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      borderRadius: 2,
                      flex: 1,
                      padding: 2
                    }}
                  >
                    <legend style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                      <Typography variant="body1" sx={{ pl: 0.5, pr: 0.5, }}>
                        {displayedValue}
                      </Typography>
                    </legend>

                    <BackupButton dataType={dataType} />
                    <RestoreButton dataType={dataType} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 32px;
`;
