import styled from "styled-components";
import { Backup, Bolt } from "@mui/icons-material";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useBackupData, useRestoreData } from "../../api";
import { Fragment } from "react/jsx-runtime";

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
      variant="contained"
      loading={isPending}
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

  const text = dataType === 'all' ? 'All Data' : "";

  if (isSuccess) return (
    <Typography variant="body1" color="sucess">
      Restored!
    </Typography>
  );
  return (
    <Fragment>
      <input
        type="file"
        accept=".json"
        disabled={isPending}
        style={{ display: "none" }}
        id={`restore-${dataType}-upload`}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const formData = new FormData()
            formData.append('file', file)
            restoreData({
              dataType,
              formData,
            })
          }
        }}
      />
      <label htmlFor={`restore-${dataType}-upload`}>
        <Button
          variant="contained"
          component="span"
          loading={isPending}
        >
          Restore {text}
        </Button>
      </label>
    </Fragment>
  )
}

export const Account = () => {

  return (
    <Wrapper>
      <Grid container spacing={2} flexGrow={1}>

        <Grid size={{ xs: 12, md: 4 }}>

        </Grid>

        <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h4" color="text.primary">
            Back Up Data
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
            <BackupButton dataType="all" />
            <RestoreButton dataType="all" />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, flexWrap: 'wrap' }}>
            {Object.entries(dataTypes).map(([dataType, displayedValue]) => (
              <Box
                key={dataType}
                sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
              >
                <Typography variant="h6">
                  {displayedValue}
                </Typography>
                <BackupButton dataType={dataType} />
                <RestoreButton dataType={dataType} />
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
`;
