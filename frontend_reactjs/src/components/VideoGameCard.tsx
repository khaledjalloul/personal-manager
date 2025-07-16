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
  AddPhotoAlternate
} from "@mui/icons-material";
import { Dispatch, SetStateAction, useState } from "react";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export const VideoGameCard = ({
  game,
  isAddingGame,
  setIsAddingGame
}: {
  game: VideoGame,
  isAddingGame: boolean,
  setIsAddingGame: Dispatch<SetStateAction<boolean>>
}) => {
  const [isEditing, setIsEditing] = useState(isAddingGame);
  const [name, setName] = useState(game.name);
  const [platform, setPlatform] = useState(game.platform);
  const [type, setType] = useState(game.type);
  const [completed, setCompleted] = useState(game.completed);
  const [firstPlayed, setFirstPlayed] = useState(dayjs(game.firstPlayed));
  const [price, setPrice] = useState(game.price);
  const [extraPurchases, setExtraPurchases] = useState(game.extraPurchases);
  const [storeUrl, setStoreUrl] = useState(game.storeUrl);
  const [coverImage, setCoverImage] = useState(game.coverImage);

  const sumExtraPurchases = extraPurchases.reduce((acc, purchase) => acc + purchase.price, 0);

  return (
    <Wrapper sx={{ backgroundColor: 'secondary.main' }}>
      <Box sx={{ width: '100%', aspectRatio: '16/9', position: 'relative' }} >
        {coverImage && (
          <CoverImage src={coverImage} />
        )}
        {isEditing && (
          <CoverImageEditor>
            <Box sx={{ borderRadius: '100px', backgroundColor: 'secondary.main' }}>
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
            <IconButton sx={{ ml: 'auto', }}>
              <Save color="success" />
            </IconButton>
          )}

          {isEditing && (
            <IconButton>
              <Delete color="error" />
            </IconButton>
          )}

          {isEditing && (
            <IconButton onClick={() => {
              if (game.id !== -1) {
                setName(game.name);
                setPlatform(game.platform);
                setType(game.type);
                setCompleted(game.completed);
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
            <SportsEsportsOutlined />
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
            <PeopleOutlineOutlined />
            {!isEditing ? (
              <Typography variant="body1">
                {type}
              </Typography>
            ) : (
              <Select
                variant="standard"
                sx={{ width: '100%', overflow: 'hidden' }}
                value={type}
                onChange={(e) => setType(e.target.value as VideoGameType)}
              >
                <MenuItem value={VideoGameType.ONLINE}>Online</MenuItem>
                <MenuItem value={VideoGameType.SINGLE_PLAYER}>Single Player</MenuItem>
                <MenuItem value={VideoGameType.BOTH}>Online & Single Player</MenuItem>
              </Select>
            )}
          </Grid>

          <Grid size={{ xs: 6 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Today />
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
                  slots={{
                    textField: props => <TextField
                      {...props}
                      size="small"
                      variant="standard"
                      placeholder="First Played"
                      value={firstPlayed.format('DD.MM.YYYY')}
                    />
                  }}
                />
              </LocalizationProvider>
            )}
          </Grid>

          <Grid size={{ xs: 6 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Check />
            {!isEditing ? (
              <Typography variant="body1">
                {completed ? "Completed" : "Not Completed"}
              </Typography>
            ) : (
              <Select
                variant="standard"
                sx={{ width: '100%', overflow: 'hidden' }}
                value={completed ? "true" : "false"}
                onChange={(e) => setCompleted(e.target.value === "true")}
              >
                <MenuItem value="true">Completed</MenuItem>
                <MenuItem value="false">Not Completed</MenuItem>
              </Select>
            )}
          </Grid>

          <Grid size={{ xs: 6 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SellOutlined />
            {!isEditing ? (
              <Typography variant="body1">
                {price} $
              </Typography>
            ) : (
              <TextField
                variant="standard"
                placeholder="Price"
                value={price.toFixed(2)}
                onChange={(e) => {
                  const newPrice = parseFloat(e.target.value);
                  setPrice(isNaN(newPrice) ? price : newPrice);
                }}
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end">$</InputAdornment>,
                  }
                }}
              />
            )}
          </Grid>

          <Grid size={{ xs: 6 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CreditCard />
            {!isEditing ? (
              <Typography variant="body1">
                {sumExtraPurchases} $
              </Typography>
            ) : (
              <TextField
                variant="standard"
                placeholder="Extra Purchases"
                value={sumExtraPurchases.toFixed(2)}
                onChange={(e) => {
                  const newPrice = parseFloat(e.target.value);
                  setPrice(isNaN(newPrice) ? sumExtraPurchases : newPrice);
                }}
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end">$</InputAdornment>,
                  }
                }}
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