import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import styled from "styled-components";
import { VideoGame, VideoGameType } from "../types";
import {
  Edit,
  Today,
  Save,
  Delete,
  Clear,
  Check,
  CreditCard,
  SellOutlined,
  SportsEsportsOutlined,
  PeopleOutlineOutlined,
  InsertLink,
  AddPhotoAlternate,
  DoneAll
} from "@mui/icons-material";
import { Dispatch, SetStateAction, useState } from "react";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useCreateVideoGame, useDeleteVideoGame, useEditVideoGame } from "../api";
import { ConfirmDeleteDialog } from "./modals";

const videoGameTypeOptions = {
  [VideoGameType.Single_Player]: "Single Player",
  [VideoGameType.Online]: "Online",
  [VideoGameType.Both]: "Online & Single Player"
}

export const VideoGameCard = ({
  game,
  isAddingGame,
  setIsAddingGame
}: {
  game: VideoGame,
  isAddingGame: boolean,
  setIsAddingGame: Dispatch<SetStateAction<boolean>>
}) => {

  const { mutate: createGame, isPending: createLoading } = useCreateVideoGame();
  const { mutate: editGame, isPending: editLoading } = useEditVideoGame();
  const { mutate: deleteGame, isPending: deleteLoading } = useDeleteVideoGame();

  const [isEditing, setIsEditing] = useState(isAddingGame);
  const [name, setName] = useState(game.name);
  const [platform, setPlatform] = useState(game.platform);
  const [type, setType] = useState(game.type);
  const [completionCount, setCompletionCount] = useState(game.completionCount);
  const [firstPlayed, setFirstPlayed] = useState(dayjs(game.firstPlayed));
  const [price, setPrice] = useState(game.price);
  const [extraPurchases, setExtraPurchases] = useState(game.extraPurchases);
  const [storeUrl, setStoreUrl] = useState(game.storeUrl);
  const [coverImage, setCoverImage] = useState(game.coverImage);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  return (
    <Wrapper sx={{ backgroundColor: 'primary.light' }}>
      <Box sx={{ width: '100%', aspectRatio: '16/9', position: 'relative' }} >
        {coverImage && (
          <CoverImage src={coverImage} />
        )}
        {isEditing && (
          <CoverImageEditor>
            <Box sx={{ borderRadius: '100px', backgroundColor: 'primary.light' }}>
              <IconButton>
                <AddPhotoAlternate />
              </IconButton>
            </Box>
          </CoverImageEditor>
        )}
      </Box>

      <ContentBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!isEditing ? (
            <Typography variant="h6" color="text.primary" sx={{ mr: 1 }}>
              {name}
            </Typography>
          ) : (
            <TextField
              variant="standard"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          {!isEditing && (
            <IconButton sx={{ ml: 'auto' }} onClick={() => setIsEditing(true)}>
              <Edit />
            </IconButton>
          )}

          {isEditing && (
            <IconButton
              color="success"
              sx={{ ml: 'auto' }}
              loading={createLoading || editLoading}
              disabled={!name.trim()}
              onClick={() => {
                if (game.id !== -1) {
                  editGame({
                    id: game.id,
                    name: name.trim(),
                    platform: platform.trim(),
                    type,
                    completionCount,
                    firstPlayed: firstPlayed.toDate(),
                    price,
                    extraPurchases,
                    storeUrl: storeUrl.trim(),
                    coverImage: coverImage?.trim()
                  });
                  setIsEditing(false);
                } else {
                  createGame({
                    name: name.trim(),
                    platform: platform.trim(),
                    type,
                    completionCount,
                    firstPlayed: firstPlayed.toDate(),
                    price,
                    extraPurchases,
                    storeUrl: storeUrl.trim(),
                    coverImage: coverImage?.trim()
                  });
                }
                setIsAddingGame(false);
              }}
            >
              <Save />
            </IconButton>
          )}

          {isEditing && game.id !== -1 && (
            <IconButton
              color="error"
              loading={deleteLoading}
              onClick={() => setConfirmDeleteOpen(true)}
            >
              <Delete />
            </IconButton>
          )}

          {isEditing && (
            <IconButton onClick={() => {
              if (game.id !== -1) {
                setName(game.name);
                setPlatform(game.platform);
                setType(game.type);
                setCompletionCount(game.completionCount);
                setFirstPlayed(dayjs(game.firstPlayed));
                setPrice(game.price);
                setExtraPurchases(game.extraPurchases);
                setStoreUrl(game.storeUrl);
                setCoverImage(game.coverImage);
                setIsEditing(false);
              } else {
                setIsAddingGame(false);
              }
            }}>
              <Clear />
            </IconButton>
          )}

          {!isEditing && (
            <IconButton onClick={() => window.open(storeUrl, '_blank')}>
              <InsertLink />
            </IconButton>
          )}
        </Box>

        <Grid container rowSpacing={1} columnSpacing={2}>
          <Grid size={{ xs: 6 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SportsEsportsOutlined sx={{ color: "text.primary" }} />
            {!isEditing ? (
              <Typography variant="body1">
                {platform}
              </Typography>
            ) : (
              <TextField
                variant="standard"
                placeholder="Platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              />
            )}
          </Grid>

          <Grid size={{ xs: 6 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PeopleOutlineOutlined sx={{ color: "text.primary" }} />
            {!isEditing ? (
              <Typography variant="body1">
                {videoGameTypeOptions[type]}
              </Typography>
            ) : (
              <Select
                variant="standard"
                sx={{ width: '100%', overflow: 'hidden' }}
                value={type}
                onChange={(e) => setType(e.target.value as VideoGameType)}
              >
                <MenuItem value={VideoGameType.Online}>{videoGameTypeOptions[VideoGameType.Online]}</MenuItem>
                <MenuItem value={VideoGameType.Single_Player}>{videoGameTypeOptions[VideoGameType.Single_Player]}</MenuItem>
                <MenuItem value={VideoGameType.Both}>{videoGameTypeOptions[VideoGameType.Both]}</MenuItem>
              </Select>
            )}
          </Grid>

          <Grid size={{ xs: 6 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Today sx={{ color: "text.primary" }} />
            {!isEditing ? (
              <Typography variant="body1">
                {firstPlayed.format("DD.MM.YYYY")}
              </Typography>
            ) : (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={firstPlayed}
                  onChange={(newValue) => setFirstPlayed(newValue ?? dayjs(new Date()))}
                  enableAccessibleFieldDOMStructure={false}
                  format="DD.MM.YYYY"
                  slotProps={{
                    textField: {
                      size: "small",
                      variant: "standard",
                      placeholder: "First Played",
                    }
                  }}
                />
              </LocalizationProvider>
            )}
          </Grid>

          <Grid size={{ xs: 6 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {type !== VideoGameType.Online && (
              completionCount > 1 ? <DoneAll sx={{ color: "text.primary" }} /> :
                completionCount === 1 ? <Check sx={{ color: "text.primary" }} /> :
                  <Clear sx={{ color: "text.primary" }} />
            )}
            {type !== VideoGameType.Online && (
              !isEditing ? (
                <Typography variant="body1">
                  {completionCount ? "CompletionCount" : "Not CompletionCount"}
                </Typography>
              ) : (
                // <Select
                //   variant="standard"
                //   sx={{ width: '100%', overflow: 'hidden' }}
                //   value={completionCount ? "true" : "false"}
                //   onChange={(e) => setCompletionCount(e.target.value === "true")}
                // >
                //   <MenuItem value="true">CompletionCount</MenuItem>
                //   <MenuItem value="false">Not CompletionCount</MenuItem>
                // </Select>
                <Box />
              ))}
          </Grid>

          <Grid size={{ xs: 6 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SellOutlined sx={{ color: "text.primary" }} />
            {!isEditing ? (
              <Typography variant="body1">
                {price}
              </Typography>
            ) : (
              <TextField
                variant="standard"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            )}
          </Grid>

          <Grid size={{ xs: 6 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CreditCard sx={{ color: "text.primary" }} />
            {!isEditing ? (
              <Typography variant="body1">
                {extraPurchases}
              </Typography>
            ) : (
              <TextField
                variant="standard"
                placeholder="Extra Purchases"
                value={extraPurchases}
                onChange={(e) => setExtraPurchases(e.target.value)}
              />
            )}
          </Grid>

          {isEditing && (
            <Grid size={{ xs: 12 }} sx={{ display: 'flex' }}>
              <TextField
                variant="standard"
                placeholder="Store URL"
                value={storeUrl}
                sx={{ flexGrow: 1 }}
                onChange={(e) => setStoreUrl(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start"><InsertLink /></InputAdornment>,
                  }
                }}
              />
            </Grid>
          )}
        </Grid>
      </ContentBox>
      <ConfirmDeleteDialog
        isOpen={confirmDeleteOpen}
        setIsOpen={setConfirmDeleteOpen}
        itemName={`video game: ${name}`}
        deleteFn={() => deleteGame({ id: game.id })}
      />
    </Wrapper>
  )
}

const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  border-radius: 8px;
`;

const CoverImage = styled.img`
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  width: 100%;
  aspect-ratio: 16/9;
`;

const CoverImageEditor = styled(Box)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #00000077;
  margin-bottom: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentBox = styled(Box)`
  padding: 24px;
  padding-top: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;